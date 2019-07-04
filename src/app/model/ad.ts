export class Ad {
  relevance: number
  id: number
  headline: string
  description: AdDescription
  occupation: OccupationValue
  occupation_field: OccupationValue
  occupation_group: OccupationValue
  must_have: {
    skills: [ReqValue],
    languages: [ReqValue],
    work_experiences: [ReqValue]
  }
  nice_to_have: {
    skills: [ReqValue],
    languages: [ReqValue],
    work_experiences: [ReqValue]
  }
  employer: {
    name: string
    workplace: string
  }
  workplace_address: {
    country: string
    municipality: string
    region: string
    city: string
  }
}

export class AdDescription {
  text: string
}

export class OccupationValue {
  label: string
}

export class ReqValue {
  label: string
}