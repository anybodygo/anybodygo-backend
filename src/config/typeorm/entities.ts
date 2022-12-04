import { Request } from '../../requests/entities/request.entity';
import { RequestDirection } from '../../request-directions/entities/request-direction.entity';
import { City } from '../../cities/entities/city.entity';
import { Country } from '../../countries/entities/country.entity';
import {LocationView} from "../../views/location.view";

const entities = [Request, RequestDirection, City, Country, LocationView];

export {Request};
export {RequestDirection};
export {City};
export {Country};
export {LocationView};
export default entities;