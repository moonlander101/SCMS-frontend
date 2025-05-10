import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http: HttpClient) { }

  fetchAssignmentsByVehicle(vehicleId: string) {
    const url = `http://127.0.0.1:8003/api/assignments/by-vehicle/${vehicleId}`;
    return this.http.get(url);
  }

  markArrival(assignmentId: number, sequenceNumber: number, total_load : number, status : string) {
    const url = `http://127.0.0.1:8003/api/assignments/${assignmentId}/arrive/sequence/${sequenceNumber}/`;
    const body = {
      total_load: total_load,
      status: status
    };
    return this.http.post(url, body, { responseType: 'json' });
  }

  markComplete(assignmentId: number, itemId: number, total_load : number, status : string) {
    const url = `http://127.0.0.1:8003/api/assignments/${assignmentId}/actions/${itemId}/complete/`;

    const body = {
      total_load: total_load,
      status: status
    };
    return this.http.post(url, body, { responseType: 'json' });
  }


  processArrival(assignmentId: number, sequenceNumber: number, total_load: number, status: string) {
    this.markArrival(assignmentId, sequenceNumber, total_load, status).subscribe({
      next: (response: any) => {
        console.log('Arrival processed successfully:', response);

        // Check if there are actions to process
        if (response && response.actions && Array.isArray(response.actions)) {
          // Process each action by marking it as complete
          response.actions.forEach((action: any) => {
            if (action.assignment_item_id) {
              console.log(`Processing action for item ${action.assignment_item_id}`);

              this.markComplete(
                assignmentId,
                action.assignment_item_id,
                total_load,
                status
              ).subscribe({
                next: (completeResponse) => {
                  console.log(`Action ${action.assignment_item_id} completed successfully:`, completeResponse);
                },
                error: (error) => {
                  console.error(`Error completing action ${action.assignment_item_id}:`, error);
                }
              });
            }
          });
        } else {
          console.warn('No actions found in the arrival response');
        }
      },
      error: (error) => {
        console.error('Error processing arrival:', error);
      }
    });
  }
}
