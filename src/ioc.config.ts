import { ioc } from './container'
import { AbstractBookRepository } from './modules/AbstractBookRepository'

//TEST
//import { InmemoryBookRepository } from './modules/InmemoryBookRepository'
//ioc.bind(AbstractBookRepository).to(InmemoryBookRepository).inSingletonScope()

//MONGODB
import { MongodbBookRepository } from './modules/MongodbBookRepository'
ioc.bind(AbstractBookRepository).to(MongodbBookRepository).inSingletonScope()