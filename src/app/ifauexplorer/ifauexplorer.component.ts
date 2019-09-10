import { Component, OnInit } from '@angular/core';
import { Observable, Subject, zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ifauexplorer',
  templateUrl: './ifauexplorer.component.html',
  styleUrls: ['./ifauexplorer.component.css']
})
export class IFAUExplorerComponent implements OnInit {
  title = 'ifau-test';
  users$: Observable<User[]>
  private pastClickSubject = new Subject<User[]>()
  private recomendationsSubject = new Subject<User[]>()

  constructor() {
    
  }

  ngOnInit() {
    this.users$ = zip(this.pastClickSubject, this.recomendationsSubject).pipe(
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
}

export class AdRecomendation {
  adid: number
}