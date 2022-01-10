The original spec is in original.yaml. The bundled spec is in bundled.yaml and was generated
via `openapi bundle original.yaml -o bundled.yaml` using OpenAPI CLI 1.0.0-beta.78.

The decorator being debugged is the built-in "remove-x-internal".

Things to notice:
- $ref: '#/components/parameters/Vendor' is never removed. However, the Vendor component itself is gone. This points to the component getting removed before the reference.
