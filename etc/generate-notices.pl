#!/usr/bin/env perl
use v5.10;
use strict;
use warnings;
use utf8;
use open qw/:std :utf8/;
use File::Basename qw/basename/;
use File::Find qw/find/;

my @license_files;

find(
    sub {
        return unless /^licen[cs]e(?:\..+)?$/i || /\.licen[cs]e$/i;
        push @license_files, [ $File::Find::dir, $File::Find::name ];
    },
    'node_modules'
);

for my $entry (sort { $a->[0] cmp $b->[0] or $a->[1] cmp $b->[1] } @license_files) {
    ( my $package_name = $entry->[0] ) =~ s{node_modules/}{};
    my $file = basename($entry->[1]);
    my $license_text = do { local ( @ARGV, $/ ) = $entry->[1]; <> };
    $license_text =~ s/ +$//mg;
    say "" x 70;
    say "-" x 70;
    say "License notice for $package_name ($file)";
    say "-" x 70;
    say "";
    print $license_text;
}
