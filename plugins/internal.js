const id = "internal";

/** @type {import('@redocly/openapi-cli').CustomRulesConfig} */
const decorators = {
  oas3: {
    "remove-parameters": () => {
      return {
        Parameter: {
          leave(parameter, ctx) {
            console.log("processing param %s", parameter["name"])
            if (parameter["x-internal"]) {
              console.log("deleting param %s", parameter["name"])
              ctx.parent.splice(ctx.key, 1);
            } else {
              console.log("keeping param %s", parameter["name"])
            }
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
