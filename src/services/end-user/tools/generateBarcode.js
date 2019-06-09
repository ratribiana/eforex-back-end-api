'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import barcode from 'bwip-js'

const app = express( feathers() )

app.get( '/', async ( req, res ) => {
  if (req.url.indexOf('/?bcid=') != 0) {
    res.writeHead(404, { 'Content-Type':'text/plain' });
    res.end('BWIPJS: Unknown request format.', 'utf8');
  } else {
      barcode(req, res)
  }
})

export default app
