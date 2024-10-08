const path = require('path');
const { getRegex } = require('./common/getRegex');

const meta = {
  type: 'layout',
  docs: {
    description: 'checks that filenames match a chosen pattern',
  },
  fixable: false,
  messages: {
    noMatch: "Filename '{{name}}' does not match {{value}}.",
  },
  schema: false
};

module.exports = {
  meta,
  create: (context) => ({
    Program: (node) => {
      const filename = context.getFilename();
      const includePath = !!(context.options[0] || {}).includePath;
      const name = includePath ? filename : path.basename(filename);
      const [regex, regexStr] = getRegex(context.options[0], name);
      if (!regex) return;
      if (!regex.test(name)) {
        context.report({
          node,
          messageId: 'noMatch',
          data: {
            name,
            value: regexStr,
          },
        });
      }
    },
  }),
};
