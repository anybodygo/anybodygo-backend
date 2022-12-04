import { ViewEntity, ViewColumn } from "typeorm"

@ViewEntity({
    expression: `
        (
            SELECT
                'CountryId' as type,
                id as value,
                name,
                NULL as parent,
                flag
            FROM
                countries
        )
        UNION ALL
        (
            SELECT
                'CityId' as type,
                cities.id as value,
                cities.name,
                countries.name as parent,
                NULL as flag
            FROM
                cities
            JOIN 
                countries ON cities.country_id = countries.id
        )
    `,
})
export class LocationView {
    @ViewColumn()
    type: string

    @ViewColumn()
    value: number

    @ViewColumn()
    name: string

    @ViewColumn()
    parent: string

    @ViewColumn()
    flag: string
}