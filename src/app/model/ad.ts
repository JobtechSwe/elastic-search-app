export class Ad {
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