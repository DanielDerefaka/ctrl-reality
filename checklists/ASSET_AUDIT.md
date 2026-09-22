# Final Asset Audit

## Search the runtime tree

Record commands and results for:

- [ ] `*.glb`, `*.gltf`, `*.fbx`, `*.obj`, `*.blend`, `*.stl`, `*.dae`, `*.3ds`.
- [ ] unexpected `*.bin`, large JSON, base64 strings, data URIs.
- [ ] huge literal numeric arrays or suspicious generated mesh payloads.
- [ ] remote `http://` or `https://` runtime references.
- [ ] paths containing `../` that escape `game/`.
- [ ] undeclared PNG/JPG/WebP/SVG/OGG/MP3/WAV files.
- [ ] unused candidate modules imported into production.
- [ ] prototype-only geometry or placeholder labels.

## Manifest vs scene

| Visible object | Runtime module | Receipt | Selected candidate | Verified | Provenance declared |
|---|---|---|---|---|---|
| Thief |  |  |  |  |  |
| Plate |  |  |  |  |  |
| Gate |  |  |  |  |  |
| Floor |  |  |  |  |  |
| Crank |  |  |  |  |  |
| Second hand |  |  |  |  |  |
| Pedestal/jewel |  |  |  |  |  |
| Wall/arch |  |  |  |  |  |
| Lever |  |  |  |  |  |
| Exit |  |  |  |  |  |
| Pendulum, if shipped |  |  |  |  |  |
| Gear cluster, if shipped |  |  |  |  |  |

## Result

- PASS / FAIL:
- Unexplained scanner flags:
- Removed files:
- Final audit commit:
