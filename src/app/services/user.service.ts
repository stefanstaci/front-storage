import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}


  searchEmails(query: string): Observable<string[]> {
    console.log('API searchEmails called with:');
    return this.http.get<string[]>(
      `http://localhost:7080/api/user/search`,
      {
        params: { query },
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      }
    );
  }
}
