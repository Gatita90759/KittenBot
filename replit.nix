
{ pkgs }: {
  deps = [
    pkgs.nodejs-19_x
    pkgs.nodePackages.typescript-language-server
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
