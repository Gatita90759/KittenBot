
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.libuuid
    pkgs.libGL
    pkgs.libGLU
    pkgs.freetype
    pkgs.fontconfig
    pkgs.cairo
    pkgs.pango
    pkgs.pixman
    pkgs.pkg-config
    pkgs.python3
    pkgs.makeWrapper
  ];
}
