const { generateChangeLog } = require('./changelog')
const { push } = require('./push')

async function release() {
  await generateChangeLog()
  await push()
}

release()
