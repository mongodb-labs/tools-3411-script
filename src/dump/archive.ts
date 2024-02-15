import { createReadStream } from "fs";
import { pipeline, Transform, Readable } from "stream";
import { BSON, EJSON } from "bson";
import { createGunzip } from "node:zlib";
import { promisify } from "util";

const ARCHIVE_SUFFIX_GZ = ".gz";

const BYTES_IN_INT32 = 4;
const TERMINATOR = 0xffffffff;
const MAGIC_NUMBER = 0x6de29981;

const pipelineAsync = promisify(pipeline);

class ParseArchiveStream extends Transform {
  private readonly source: Readable;
  private buffer = Buffer.alloc(0);
  private foundMagicNumber = false;
  private foundTerminator = false;

  constructor(source: Readable) {
    super({ readableObjectMode: true });
    this.source = source;
  }

  isDone() {
    return this.foundTerminator;
  }

  _transform(chunk: Buffer, _: any, callback: Function) {
    try {
      this._doTransform(chunk, callback);
    } catch (error) {
      console.error("Failed to parse archive file: ", error);
    }
  }

  _doTransform(chunk: Buffer, callback: Function) {
    if (this.foundTerminator) {
      this.source.unpipe(this);
      this.push(null);
      return callback();
    }
    this.buffer = Buffer.concat([this.buffer, chunk]);
    this._trySkipMagicNumber();
    while (this._tryPushNextDocument()) {}
    callback();
  }

  _trySkipMagicNumber(): void {
    if (this.foundMagicNumber) {
      return;
    }
    const magicNumberIndex = this.buffer.indexOf(int32ToBytes(MAGIC_NUMBER));
    if (magicNumberIndex !== 0) {
      throw new Error(
        "Invalid archive file. Are you sure this is a MongoDB archive dump?"
      );
    }
    this.foundMagicNumber = true;
    this.buffer = this.buffer.subarray(BYTES_IN_INT32);
  }

  _tryPushNextDocument(): boolean {
    const { documentLength, ok } = this._tryGetNextDocumentLength();
    if (!ok) {
      return false;
    }
    const document = readDocumentMetadata(this.buffer, documentLength);
    this.push(document);
    this.buffer = this.buffer.subarray(documentLength);
    return true;
  }

  _tryGetNextDocumentLength(): { documentLength?: number; ok: boolean } {
    if (this.buffer.length < BYTES_IN_INT32) {
      return { ok: false };
    }
    const nextUint32 = this.buffer.readUInt32LE();
    if (nextUint32 === TERMINATOR) {
      this.foundTerminator = true;
      return { ok: false };
    }
    const documentLength = nextUint32;
    if (documentLength > this.buffer.length) {
      return { ok: false };
    }
    return { documentLength, ok: true };
  }
}

export async function parseArchive(archiveFilepath: string): Promise<any[]> {
  const archiveStreams = createArchiveStreams(archiveFilepath);
  const sourceStream = archiveStreams[archiveStreams.length - 1];
  const parseArchiveStream = new ParseArchiveStream(sourceStream);

  const objects = [];
  try {
    const collection = collectStreamObjects(objects, parseArchiveStream);
    await pipelineAsync([...archiveStreams, parseArchiveStream]);
    await collection;
    return objects;
  } catch (error) {
    if (parseArchiveStream.isDone()) {
      return objects;
    } else {
      console.error("Failed to parse archive: ", error);
      throw error;
    }
  }
}

function createArchiveStreams(archiveFilepath: string): Readable[] {
  const readStream = createReadStream(archiveFilepath);
  const gunzipStream = createGunzip();
  return archiveFilepath.endsWith(ARCHIVE_SUFFIX_GZ)
    ? [readStream, gunzipStream]
    : [readStream];
}

async function collectStreamObjects(
  objects: any[],
  stream: ParseArchiveStream
): Promise<void> {
  for await (const obj of stream) {
    objects.push(obj);
  }
}

function readDocumentMetadata(
  buffer: Buffer,
  documentLength: number
): BSON.Document {
  const documentBytes = buffer.subarray(0, documentLength);
  const document = BSON.deserialize(documentBytes);
  const metadata =
    document.metadata == null ? {} : EJSON.parse(document.metadata);
  return {
    name: document.collection,
    db: document.db,
    ...metadata,
  };
}

function int32ToBytes(n: number): Buffer {
  const buffer = Buffer.alloc(BYTES_IN_INT32);
  buffer.writeUInt32BE(n, 0);
  return buffer;
}
