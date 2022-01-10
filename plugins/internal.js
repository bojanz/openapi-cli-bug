const id = "internal";

/** @type {import('@redocly/openapi-cli').CustomRulesConfig} */
const decorators = {
  oas3: {
    "remove-parameters": () => {
      function removeParameters(node, ctx) {
        if (!node.parameters) {
          return;
        }

        let didDelete = false;
        for (let i = 0; i < node.parameters.length; i++) {
          if (!node.parameters[i]) {
            continue;
          }
          parameter = node.parameters[i];
          if (parameter["$ref"]) {
            resolved = ctx.resolve({
              $ref: parameter["$ref"],
            });
            parameter = resolved.node;
          }
          if (parameter["x-internal"]) {
            node.parameters.splice(i, 1);
            didDelete = true;
            i--;
          }
        }
      }

      return {
        Operation: {
          leave(operation, ctx) {
            removeParameters(operation, ctx);
          },
        },
        PathItem: {
          leave(pathItem, ctx) {
            removeParameters(pathItem, ctx);
          },
        },
      };
    },
    "remove-properties": () => {
      return {
        SchemaProperties: {
          leave(properties, ctx) {
            for (const propertyName of Object.keys(properties)) {
              if (properties[propertyName]["x-internal"]) {
                delete properties[propertyName];
              } else if (properties[propertyName]["$ref"]) {
                resolved = ctx.resolve({
                  $ref: properties[propertyName]["$ref"],
                });
                if (resolved.node && resolved.node["x-internal"]) {
                  delete properties[propertyName];
                }
              }
            }
          },
        },
      };
    },
    "remove-components": () => {
      return {
        Components: {
          leave(components) {
            for (const componentType of Object.keys(components)) {
              for (const componentName of Object.keys(components[componentType])) {
                console.log("processing component %s/%s", componentType, componentName)
                if (components[componentType][componentName]["x-internal"]) {
                  console.log("deleting component %s/%s", componentType, componentName)
                  delete components[componentType][componentName];
                } else {
                  console.log("keeping component %s/%s", componentType, componentName)
                }
              }
            }
          },
        },
      };
    },
  },
};

module.exports = {
  id,
  decorators,
};
