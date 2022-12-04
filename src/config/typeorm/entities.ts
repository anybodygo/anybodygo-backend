import { Request } from '../../requests/entities/request.entity';
import { RequestDirection } from '../../request-directions/entities/request-direction.entity';
import { City } from '../../cities/entities/city.entity';
import { Country } from '../../countries/entities/country.entity';

const entities = [Request, RequestDirection, City, Country,];

export {Request};
export {RequestDirection};
export {City};
export {Country};
export default entities;