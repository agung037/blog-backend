/* eslint-disable no-undef */
const info = (...params) => { 
  if(process.env.NODE_ENV !== 'test'){
    console.log('🟩 ',...params)
  }
}

const error = (...params) => { 
  if(process.env.NODE_ENV !== 'test'){
    console.log('🟥 ', ...params)
  }
}

module.exports = {
  info, error
}
 