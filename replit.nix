
{ pkgs }: {
  deps = [
    pkgs.nodejs
    pkgs.uuid
    pkgs.yarn
    pkgs.replitPackages.jest
    pkgs.cairo
    pkgs.pango
    pkgs.pkgconfig
    pkgs.libpng
    pkgs.libjpeg
    pkgs.giflib
    pkgs.librsvg
    pkgs.libuuid
    pkgs.pixman
  ];
}
