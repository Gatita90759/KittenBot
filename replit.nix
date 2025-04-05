
{ pkgs }: {
  deps = [
    pkgs.nodejs
    pkgs.uuid
    pkgs.yarn
    pkgs.replitPackages.jest
    pkgs.cairo
    pkgs.pango
    pkgs.libjpeg
    pkgs.giflib
    pkgs.librsvg
  ];
}
