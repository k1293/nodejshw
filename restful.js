const axios = require('axios')

axios
  .delete('http://localhost:3000/shop/789', {
    shopname: 'abcdefg',
    address: '12sdf3',
    phone: '293574',
    owner: 'davsdffdssdfi224d',
  })
//  .get('http://localhost:3000/read-data/')
  .then(res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)	
  })
  .catch(error => {
    console.error(error)
  })
