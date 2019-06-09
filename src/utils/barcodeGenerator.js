import barcode from 'bwip-js'

export const generateBarcode = async text => {
    return new Promise((resolve, reject) => {
      barcode.toBuffer({
          bcid:        'code128',
          text:        text,
          scale:       3,
          height:      10,
          includetext: true,
          textxalign:  'center',
          paddingwidth: 3,
          paddingheight: 3
      }, async function (err, png) {
        if (!err) {
          return resolve(png)
          // const barCodeText = await 'data:image/png;base64,' + png.toString('base64')
          // return resolve(barCodeText)
        }
      })
    })
}
