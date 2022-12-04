import {Get, Controller, Res, HttpStatus, Req, Param, Query} from '@nestjs/common';
import {LocationParserService} from "../providers/location-parser/location-parser.service";
import {LocationService} from "../providers/location/location.service";
import {LocationViewService} from "./location-view.service";

@Controller({ path: 'locations' })
export class LocationsController {
    constructor(
        private readonly locationParserService: LocationParserService,
        private readonly locationService: LocationService,
        private readonly locationViewService: LocationViewService,
    ) {}

    @Get()
    parseLocations(@Res() response)
    {
        this.locationParserService.parse();
        response.status(HttpStatus.OK).send('Locations were parsed successfully.');
    }

    @Get('search')
    search(@Query('q') query: string)
    {
        return this.locationViewService.findAll(query);
    }

    @Get(':prefix/:name')
    getLocation(@Param('prefix') prefix: string, @Param('name') name: string)
    {
        return this.locationService.getLocation(prefix, name);
    }
}