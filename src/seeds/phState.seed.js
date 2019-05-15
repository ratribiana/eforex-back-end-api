'use strict'
import {state} from 'model/state'
import config from '../../config'
import {stateList} from './volumes/phState'
import {cityList} from './volumes/phCity'

import lodash from 'lodash'

export const states = async () => {
	try {
		stateList.map( async ( stateInfo ) => {
      var cities = lodash.filter(cityList, {stateCode: stateInfo.key})
      stateInfo.cities = cities
      stateInfo.countryCode = 'PH'
      stateInfo.stateCode = stateInfo.key
      delete stateInfo.key

			var result = await state.saveState( stateInfo )
		})
		console.log( 'seeding-ph-state-done' )
	} catch ( e ) {
		console.log( 'seeding-error',e )
	}
}
