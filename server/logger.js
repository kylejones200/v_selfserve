export const log = {
  info: (obj, msg) => console.log(JSON.stringify({ level: 'info', msg, ...obj })),
  warn: (obj, msg) => console.warn(JSON.stringify({ level: 'warn', msg, ...obj })),
  error: (obj, msg) => console.error(JSON.stringify({ level: 'error', msg, ...obj })),
};
