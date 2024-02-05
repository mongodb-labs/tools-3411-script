import { createReadStream } from "fs";
import { pipeline, Transform, Stream } from "stream";
import { BSON, EJSON } from "bson";
import { createGunzip } from "node:zlib";
import { promisify } from "util";

const ARCHIVE_SUFFIX_GZ = ".gz";

const BYTES_IN_INT32 = 4;
const TERMINATOR = 0xffffffff;
const MAGIC_NUMBER = 0x6de29981;

const pipelineAsync = promisify(pipeline);

class ParseArchiveStream extends Transform {
  private buffer = Buffer.alloc(0);
  private foundMagicNumber = false;

  constructor() {
    super({ readableObjectMode: true });
  }

  _transform(chunk: Buffer, _: any, callback: Function) {
    try {
      this._doTransform(chunk, callback);
    } catch (e) {
      console.error("Chunk transformation failed: ", e);
    }
  }

  _doTransform(chunk: Buffer, callback: Function) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    if (!this._tryFindMagicNumber()) {
      return callback();
    }
    while (this._tryPushNextDocument()) {}
    callback();
  }

  _tryFindMagicNumber(): boolean {
    if (this.foundMagicNumber) {
      return true;
    }
    const magicNumberIndex = this.buffer.indexOf(int32ToBytes(MAGIC_NUMBER));
    this.foundMagicNumber = magicNumberIndex !== -1;
    if (this.foundMagicNumber) {
      this.buffer = this.buffer.subarray(magicNumberIndex + BYTES_IN_INT32);
    } else {
      this.buffer = this.buffer.subarray(this.buffer.length - BYTES_IN_INT32);
    }
    return this.foundMagicNumber;
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
  const parseArchiveStream = new ParseArchiveStream();
  const archiveStreams = createArchiveStreams(archiveFilepath);
  try {
    const objects = collectStreamObjects(parseArchiveStream);
    await pipelineAsync([...archiveStreams, parseArchiveStream]);
    return await objects;
  } catch (e) {
    console.error("Failed to parse archive: ", e);
  }
}

function createArchiveStreams(
  archiveFilepath: string
): NodeJS.ReadableStream[] {
  const readStream = createReadStream(archiveFilepath);
  const gunzipStream = createGunzip();
  return archiveFilepath.endsWith(ARCHIVE_SUFFIX_GZ)
    ? [readStream, gunzipStream]
    : [readStream];
}

async function collectStreamObjects(stream) {
  const objects = [];
  for await (const obj of stream) {
    objects.push(obj);
  }
  return objects;
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
