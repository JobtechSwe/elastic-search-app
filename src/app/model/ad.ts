export class Ad {
  id: number
  headline: string
  description: AdDescription
  occupation: OccupationValue
  occupation_field: OccupationValue
  occupation_group: OccupationValue
  keywords: AdKeywords
}

export class AdDescription {
  text: string
}

export class OccupationValue {
  label: string
}

export class AdKeywords {
  extracted: AdExtractedKeywords
}

export class AdExtractedKeywords {
  employer: Array<string>
  location: Array<string>
  occupation: Array<string>
  skill: Array<string>
}