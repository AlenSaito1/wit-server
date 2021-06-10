const axios = require('axios').default;

(async () => {
    const image = `data:image/jpg;base64,${(await axios.get('https://previews.123rf.com/images/dacosta/dacosta1306/dacosta130600154/20029627-moscow-may-25-unidentified-people-fly-kites-at-the-kite-festival-in-the-park-tsaritsyno-on-may-25-20.jpg', { responseType: 'arraybuffer'})).data.toString('base64')}`
    //console.log(await axios.get(image, { responseType: 'arraybuffer'}).data)
    const { data } = await axios.post('http://localhost:3000/api/detect',{
        image   
    }, {headers: {
        Authorization: 'zelda'
    }})
    console.log(data)
})()