import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {delay, filter} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddApplicationView} from "../dialogs/add-appllication/dialogAddApplication";
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {ApiService} from "../../shared/modules/api/api.service";
import {UserService} from "../../shared/modules/auth/user.service";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService, Role} from "../../shared/modules/auth/auth.service";
import {NotificationService, Type} from "../../shared/modules/notification/notification.service";

// import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  active: any
  app: any;
  appSelected = false
  settings = false
  username = ""
  userID = "";
  isAdmin = false

  constructor(private observer: BreakpointObserver,
              public dialog: MatDialog,
              public sharedService: SharedIDService,
              private api: ApiService,
              public userService: UserService,
              private router: Router,
              private authService: AuthService,
              private notifyService: NotificationService) {
    router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showData(e.url)
      })
  }

  ngOnInit(): void {
    this.username = this.userService.getUsername()
    this.api.getUserByName(this.username).subscribe((data: any) => {
      this.userID = data._id.$oid;
      this.sharedService.userID = this.userID
      // this.surveyService.resetSurvey()

      this.loadData()
      this.updatePermissions();
    })
  }

  showData(url: string) {
    this.settings = (url.includes("help") || url.includes("user") || url.includes("profile") || url.includes("survey"))
  }

  loadData() {
    this.api.getApplicationsOfUser(this.userID).subscribe((result: any) => {
        this.app = result
        if (result[0]) {
          this.active = result[0]._id
          this.appSelected = true
          this.sharedService.selectApplication(result[0])
        }
      }
    )
  }

  updatePermissions(): void {
    this.authService.hasRole(Role.ADMIN).subscribe((res) => {
      console.log(res)
      this.isAdmin = res
    });
  }

  // For the responsive sidenav
  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close().then(_r => {
          });
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open().then(_r => {
          });
        }
      });
  }

  openDialog(action: string, obj: any) {
    if (action == "Add") {
      obj._id = {$oid: ""}; // Only for the view, is then defined in the database
      obj.application_name = "";
      obj.application_namespace = ""
      obj.application_desc = "";
      obj.userId = this.userID;
    }
    else if (action == "Add Cluster") {
      obj._id = {$oid: ""};
      obj.cluster_name = "";
      obj.cluster_manager_URL = "";
      obj.cluster_location = ""
      obj.userId = this.userID;
    }

    obj.action = action;
    const dialogRef = this.dialog.open(DialogAddApplicationView, {data: obj});

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addApplication(result.data)
      } else if (result.event == 'Update') {
        console.log(result.data.applications[0])
        this.updateApplication(result.data.applications[0]);
      } else if (result.event == 'Delete') {
        this.deleteApplication(result.data)
      }
    });
  }

  deleteApplication(app: any): void {
    this.api.getServicesOfApplication(app._id.$oid).subscribe((services: any) => {
      for (let j of services) {
        this.api.deleteService(j)
      }
    })

    this.api.deleteApplication(app).subscribe((_success) => {
        this.notifyService.notify(Type.success, 'Application "' + app.application_name + '" deleted successfully!')
        this.loadData();
      },
      (_error) => {
        this.notifyService.notify(Type.error, 'Error: Deleting application "' + app.application_name + '" failed!')
      })
  }

  addApplication(app: any): void {
    this.api.addApplication(app).subscribe((_success) => {
        this.loadData();
      },
      (_error: any) => {
        this.notifyService.notify(Type.error, 'Error: Adding application "' + app.application_name + '" failed!')
      })
  }

  updateApplication(app: any): void {
    this.api.updateApplication(app).subscribe((_success) => {
        this.notifyService.notify(Type.success, 'Application "' + app.application_name + '" updated successfully!')
        this.loadData();
      },
      (_error) => {
        this.notifyService.notify(Type.error, 'Error: Updating application "' + app.application_name + '" failed!')
      })
  }

  handleChange() {
    this.api.getAppById(this.active.$oid).subscribe(app => {
        this.sharedService.selectApplication(app)
        this.appSelected = true
        this.router.navigate(['/control'])
      }
    );
  }

  show() {
    this.appSelected = true
  }

  logout() {
    // this.api.logoutSurvey(this.username)
    this.authService.clear()
    this.userService.logout()
  }
}


