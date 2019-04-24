export class Ad {
  id: number
  headline: string
  description: AdDescription
  occupation: OccupationValue
  occupation_field: OccupationValue
  occupation_group: OccupationValue
}

export class AdDescription {
  text: string
}

export class OccupationValue {
  label: string
}