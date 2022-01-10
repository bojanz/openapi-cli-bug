The original spec is in original.yaml. The bundled spec is in bundled.yaml and was generated
via `openapi bundle original.yaml -o bundled.yaml` using OpenAPI CLI 1.0.0-beta.78.

The decorator being debugged is "remove-parameters" in plugins/internal.js.

UPDATE: The remove-parameters decorator has been rewritten and now no longer exibits the mentioned problems.

Things to notice:
- ~~The referenced Vendor parameter is only removed from the first endpoint.
  It is ignored for all subsequent endpoints (decorator never called).
  This problem goes away if we nest the Parameter decorator under PathItem
  (but requires us to duplicate it for operation-level parameters).
  Alternatively, the problem goes away if we dereference the parameter and stop using $ref.~~

- ~~`filter["external_id"]` gets removed but `filter[deleted]` doesn't (decorator not called).
   This might be a result of the splice call in the decorator?~~

Bonus observation:
It feels odd that parameter references are auto-resolved, but property references need to be resolved manually. Why isn't it automatic there as well?
