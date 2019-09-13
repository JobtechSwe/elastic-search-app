import { Component, OnInit } from '@angular/core';
import { Observable, Subject, zip, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { PBAd, PBAPIService } from '../pbapi.service';

@Component({
  selector: 'app-ifauexplorer',
  templateUrl: './ifauexplorer.component.html',
  styleUrls: ['./ifauexplorer.component.css']
})
export class IFAUExplorerComponent implements OnInit {
  title = 'ifau-test';
  users$: Observable<User[]>
  private pastClickSubject = new Subject<Array<User>>()
  private recomendationsSubject = new Subject<User[]>()

  constructor(private adService: PBAPIService) {

  }

  ngOnInit() {
    let enrichedPastClicks = this.pastClickSubject.pipe(
      flatMap(data => {
        let userIds = data.map(user => {
          return user.adClicks.map(click => { return click.adid })
        })
        let allAdIds: Array<number> = [].concat.apply([], userIds)
        //console.log('userIds: ' + userIds)
        //console.log('allAdIds: ' + allAdIds)
        return this.adService.getAds(allAdIds).pipe(
          map(ads => {
            //console.log('ads' + ads.map(ad => { return ad.rubrik}))
            data.forEach(value => {
              //console.log('value: ' + value.deviceid)
              value.adClicks.forEach(adClick => {
                //console.log('adClick: ' + adClick.adid)
                adClick.ad = ads.find(ad => {
                  return ad.id == adClick.adid
                })
                //console.log('adClick.ad.id: ' + adClick.ad.id)
              })
            })
            //console.log('data: ' + data)
            return data
          })
        )
      })
    )

    let enrichedRecomendations = this.recomendationsSubject.pipe(
      flatMap(data => {
        let userIds = data.map(user => {
          return user.adRecomendations.map(recomendation => { return recomendation.adid })
        })
        let allAdIds: Array<number> = [].concat.apply([], userIds)
        return this.adService.getAds(allAdIds).pipe(
          map(ads => {
            //console.log('ads' + ads.map(ad => { return ad.rubrik}))
            data.forEach(value => {
              //console.log('value: ' + value.deviceid)
              value.adRecomendations.forEach(adRecomendation => {
                //console.log('adClick: ' + adClick.adid)
                adRecomendation.ad = ads.find(ad => {
                  return ad.id == adRecomendation.adid
                })
                //console.log('adClick.ad.id: ' + adClick.ad.id)
              })
            })
            //console.log('data: ' + data)
            return data
          })
        )
      })
    )


    this.users$ = zip(enrichedPastClicks, enrichedRecomendations).pipe(
      map(users => {
        let pastClicks = users[0]
        let recomendations = users[1]
        console.log(pastClicks)
        recomendations.forEach(recomendation => {
          let existingUser = pastClicks.find(user => user.deviceid === recomendation.deviceid)
          if (existingUser != undefined) {
            existingUser.adRecomendations = recomendation.adRecomendations
          }
        })
        return pastClicks
      })
    )
  }

  public uploadPastClicks(files: FileList) {
    console.log(files);
    if (files && files.length > 0) {
      let file: File = files.item(0);
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let users: Array<User> = []
        let csv: string = reader.result as string;
        console.log(csv);
        let rows = csv.split('\n')
        rows.shift()
        rows.forEach(row => {
          let data = row.split(',')
          let deviceID = data[1]
          let adID = +data[2]
          let clickTime = new Date(+data[3])
          if (deviceID != undefined && adID != undefined) {
            let existingUser = users.find(user => user.deviceid === deviceID)
            if (existingUser == undefined) {
              existingUser = new User
              existingUser.deviceid = deviceID
              users.push(existingUser)
            }
            let adClick = new AdClick()
            adClick.adid = adID
            adClick.timestamp = clickTime
            existingUser.adClicks.push(adClick)
          } else {
            console.log('Fel: ' + row)
          }
        })
        this.pastClickSubject.next(users)
      }
    }
  }

  public uploadRecomendations(files: FileList) {
    console.log(files);
    if (files && files.length > 0) {
      let file: File = files.item(0);
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let users: Array<User> = []
        let csv: string = reader.result as string;
        console.log(csv);
        let rows = csv.split('\n')
        rows.shift()
        rows.forEach(row => {
          let data = row.split(',')
          let deviceID = data[2]
          let adID = +data[1]
          if (deviceID != undefined && adID != undefined) {
            let existingUser = users.find(user => user.deviceid === deviceID)
            if (existingUser == undefined) {
              existingUser = new User
              existingUser.deviceid = deviceID
              users.push(existingUser)
            }
            let adRecomendation = new AdRecomendation()
            adRecomendation.adid = adID
            existingUser.adRecomendations.push(adRecomendation)
          } else {
            console.log('Fel: ' + row)
          }
        })
        this.recomendationsSubject.next(users)
      }
    }
  }
}

export class User {
  deviceid: string
  adClicks: AdClick[]
  adRecomendations: AdRecomendation[]

  constructor() {
    this.adClicks = new Array
    this.adRecomendations = new Array
  }
}

export class AdClick {
  adid: number
  timestamp: Date
  ad: PBAd
}

export class AdRecomendation {
  adid: number
  ad: PBAd
}