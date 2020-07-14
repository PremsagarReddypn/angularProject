import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { feedbackURL } from '../shared/baseurl';
import { map,catchError } from'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Observable,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  
  

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) {}
      
      onsubmitFeedback(feedback: string): Observable<feedback>{
        return this.http.post<feedback>(this.feedbackURL,feedback)
        .pipe(catchError(this.processHTTPMsgService.handleError));
   
     }

     

}
