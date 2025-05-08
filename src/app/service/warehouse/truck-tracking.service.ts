import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface TruckSummary {
  truck_id: string;
  plate_number: string;
  model: string;
  is_active: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  location_name: string;
  timestamp: string;
}

export interface Driver {
  driver_id: string;
  name: string;
  contact_number: string;
  license_number: string;
}

export interface TruckDetails {
  plate_number: string;
  truck_id: string;
  model: string;
  status: {
    current_location: Location;
    location_history: Location[];
  };
  driver: Driver;
}

@Injectable({
  providedIn: 'root',
})
export class TruckTrackingService {
  constructor() {}

  getTrucks(): Observable<TruckSummary[]> {
    // Hardcoded data from 1_truck_summery.json
    const trucks: TruckSummary[] = [
      {
        truck_id: 'TRK100',
        plate_number: 'UP-4586',
        model: 'Tata LPT 1613',
        is_active: false,
      },
      {
        truck_id: 'TRK101',
        plate_number: 'SP-1505',
        model: 'Toyota Dyna',
        is_active: false,
      },
      {
        truck_id: 'TRK102',
        plate_number: 'WP-4705',
        model: 'BharatBenz 1217C',
        is_active: false,
      },
      {
        truck_id: 'TRK103',
        plate_number: 'SB-6602',
        model: 'BharatBenz 1217C',
        is_active: true,
      },
      {
        truck_id: 'TRK104',
        plate_number: 'SG-5528',
        model: 'Force Traveller',
        is_active: false,
      },
      {
        truck_id: 'TRK105',
        plate_number: 'WP-1107',
        model: 'Eicher Pro 2049',
        is_active: false,
      },
      {
        truck_id: 'TRK106',
        plate_number: 'SB-6670',
        model: 'Tata Ace Gold',
        is_active: true,
      },
      {
        truck_id: 'TRK107',
        plate_number: 'CP-9149',
        model: 'Isuzu N-Series',
        is_active: false,
      },
      {
        truck_id: 'TRK108',
        plate_number: 'UP-5024',
        model: 'Ashok Leyland Boss',
        is_active: true,
      },
      {
        truck_id: 'TRK109',
        plate_number: 'NW-2150',
        model: 'BharatBenz 1217C',
        is_active: true,
      },
      {
        truck_id: 'TRK110',
        plate_number: 'CP-3627',
        model: 'Isuzu N-Series',
        is_active: false,
      },
      {
        truck_id: 'TRK111',
        plate_number: 'NW-4274',
        model: 'Toyota Dyna',
        is_active: false,
      },
      {
        truck_id: 'TRK112',
        plate_number: 'SP-6138',
        model: 'BharatBenz 1217C',
        is_active: true,
      },
      {
        truck_id: 'TRK113',
        plate_number: 'SG-2243',
        model: 'Toyota Dyna',
        is_active: true,
      },
      {
        truck_id: 'TRK114',
        plate_number: 'SG-8940',
        model: 'Ashok Leyland Boss',
        is_active: true,
      },
      {
        truck_id: 'TRK115',
        plate_number: 'SG-5993',
        model: 'Tata LPT 1613',
        is_active: false,
      },
      {
        truck_id: 'TRK116',
        plate_number: 'NW-1271',
        model: 'Isuzu N-Series',
        is_active: false,
      },
      {
        truck_id: 'TRK117',
        plate_number: 'SP-6783',
        model: 'BharatBenz 1217C',
        is_active: false,
      },
      {
        truck_id: 'TRK118',
        plate_number: 'NC-3152',
        model: 'Tata Ace Gold',
        is_active: false,
      },
      {
        truck_id: 'TRK119',
        plate_number: 'NW-8968',
        model: 'Eicher Pro 2049',
        is_active: true,
      },
      {
        truck_id: 'TRK120',
        plate_number: 'WP-9751',
        model: 'Ashok Leyland Boss',
        is_active: true,
      },
      {
        truck_id: 'TRK121',
        plate_number: 'NC-7113',
        model: 'Ashok Leyland Boss',
        is_active: true,
      },
      {
        truck_id: 'TRK122',
        plate_number: 'EP-3813',
        model: 'Mahindra Furio',
        is_active: false,
      },
      {
        truck_id: 'TRK123',
        plate_number: 'WP-5791',
        model: 'Mahindra Furio',
        is_active: false,
      },
      {
        truck_id: 'TRK124',
        plate_number: 'NC-7181',
        model: 'Eicher Pro 2049',
        is_active: false,
      },
      {
        truck_id: 'TRK125',
        plate_number: 'SG-9273',
        model: 'Ashok Leyland Boss',
        is_active: true,
      },
      {
        truck_id: 'TRK126',
        plate_number: 'SG-9360',
        model: 'Toyota Dyna',
        is_active: true,
      },
      {
        truck_id: 'TRK127',
        plate_number: 'SG-3861',
        model: 'Toyota Dyna',
        is_active: true,
      },
      {
        truck_id: 'TRK128',
        plate_number: 'CP-3713',
        model: 'BharatBenz 1217C',
        is_active: false,
      },
      {
        truck_id: 'TRK129',
        plate_number: 'EP-7618',
        model: 'BharatBenz 1217C',
        is_active: true,
      },
      {
        truck_id: 'TRK130',
        plate_number: 'CP-8714',
        model: 'Ashok Leyland Boss',
        is_active: true,
      },
      {
        truck_id: 'TRK131',
        plate_number: 'NC-9378',
        model: 'Tata Ace Gold',
        is_active: true,
      },
      {
        truck_id: 'TRK132',
        plate_number: 'NW-7120',
        model: 'BharatBenz 1217C',
        is_active: false,
      },
      {
        truck_id: 'TRK133',
        plate_number: 'SB-3155',
        model: 'Ashok Leyland Boss',
        is_active: false,
      },
      {
        truck_id: 'TRK134',
        plate_number: 'EP-4484',
        model: 'Tata Ace Gold',
        is_active: true,
      },
      {
        truck_id: 'TRK135',
        plate_number: 'EP-2567',
        model: 'Tata LPT 1613',
        is_active: true,
      },
      {
        truck_id: 'TRK136',
        plate_number: 'NP-9819',
        model: 'Toyota Dyna',
        is_active: false,
      },
      {
        truck_id: 'TRK137',
        plate_number: 'SG-6609',
        model: 'Isuzu N-Series',
        is_active: true,
      },
      {
        truck_id: 'TRK138',
        plate_number: 'NW-9769',
        model: 'BharatBenz 1217C',
        is_active: true,
      },
      {
        truck_id: 'TRK139',
        plate_number: 'SG-9390',
        model: 'Force Traveller',
        is_active: false,
      },
    ];

    return of(trucks);
  }

  getTruckDetails(truckId: string): Observable<TruckDetails> {
    // Array of all possible truck details from 2_truck_details_extended.json
    const truckDetailsArray: TruckDetails[] = [
      {
        "plate_number": "SB-6602",
        "truck_id": "TRK103",
        "model": "BharatBenz 1217C",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV192",
          "name": "Kamala Perera",
          "contact_number": "+94 713471527",
          "license_number": "D540653794"
        }
      },
      {
        "plate_number": "SB-6670",
        "truck_id": "TRK106",
        "model": "Tata Ace Gold",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV795",
          "name": "Kamala Fernando",
          "contact_number": "+94 798501331",
          "license_number": "D934249964"
        }
      },
      {
        "plate_number": "UP-5024",
        "truck_id": "TRK108",
        "model": "Ashok Leyland Boss",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV180",
          "name": "Nimal Perera",
          "contact_number": "+94 709304700",
          "license_number": "D384120930"
        }
      },
      {
        "plate_number": "NW-2150",
        "truck_id": "TRK109",
        "model": "BharatBenz 1217C",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV723",
          "name": "Nimal Wijesinghe",
          "contact_number": "+94 785630165",
          "license_number": "D432271792"
        }
      },
      {
        "plate_number": "SP-6138",
        "truck_id": "TRK112",
        "model": "BharatBenz 1217C",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV641",
          "name": "Kamala Fernando",
          "contact_number": "+94 775124741",
          "license_number": "D587219075"
        }
      },
      {
        "plate_number": "SG-2243",
        "truck_id": "TRK113",
        "model": "Toyota Dyna",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV579",
          "name": "Sajith Perera",
          "contact_number": "+94 727285541",
          "license_number": "D298003283"
        }
      },
      {
        "plate_number": "SG-8940",
        "truck_id": "TRK114",
        "model": "Ashok Leyland Boss",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV570",
          "name": "Sajith Perera",
          "contact_number": "+94 728580785",
          "license_number": "D882670896"
        }
      },
      {
        "plate_number": "NW-8968",
        "truck_id": "TRK119",
        "model": "Eicher Pro 2049",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV350",
          "name": "Ruwan Wijesinghe",
          "contact_number": "+94 783958226",
          "license_number": "D719619617"
        }
      },
      {
        "plate_number": "WP-9751",
        "truck_id": "TRK120",
        "model": "Ashok Leyland Boss",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV506",
          "name": "Ruwan Wijesinghe",
          "contact_number": "+94 738940738",
          "license_number": "D885185707"
        }
      },
      {
        "plate_number": "NC-7113",
        "truck_id": "TRK121",
        "model": "Ashok Leyland Boss",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV533",
          "name": "John Wijesinghe",
          "contact_number": "+94 736433936",
          "license_number": "D265722049"
        }
      },
      {
        "plate_number": "SG-9273",
        "truck_id": "TRK125",
        "model": "Ashok Leyland Boss",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV382",
          "name": "John Wijesinghe",
          "contact_number": "+94 743444716",
          "license_number": "D237155889"
        }
      },
      {
        "plate_number": "SG-9360",
        "truck_id": "TRK126",
        "model": "Toyota Dyna",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV672",
          "name": "Sajith Fernando",
          "contact_number": "+94 756133478",
          "license_number": "D781065267"
        }
      },
      {
        "plate_number": "SG-3861",
        "truck_id": "TRK127",
        "model": "Toyota Dyna",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV789",
          "name": "Nimal Fernando",
          "contact_number": "+94 761736664",
          "license_number": "D205648499"
        }
      },
      {
        "plate_number": "EP-7618",
        "truck_id": "TRK129",
        "model": "BharatBenz 1217C",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV931",
          "name": "Nimal Fernando",
          "contact_number": "+94 738346414",
          "license_number": "D743983814"
        }
      },
      {
        "plate_number": "CP-8714",
        "truck_id": "TRK130",
        "model": "Ashok Leyland Boss",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV519",
          "name": "Kamala Wijesinghe",
          "contact_number": "+94 795617912",
          "license_number": "D678214726"
        }
      },
      {
        "plate_number": "NC-9378",
        "truck_id": "TRK131",
        "model": "Tata Ace Gold",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV458",
          "name": "Sajith Silva",
          "contact_number": "+94 749556918",
          "license_number": "D809065116"
        }
      },
      {
        "plate_number": "EP-4484",
        "truck_id": "TRK134",
        "model": "Tata Ace Gold",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV478",
          "name": "Sajith Fernando",
          "contact_number": "+94 768661583",
          "license_number": "D359665317"
        }
      },
      {
        "plate_number": "EP-2567",
        "truck_id": "TRK135",
        "model": "Tata LPT 1613",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV765",
          "name": "Kamala Perera",
          "contact_number": "+94 708474582",
          "license_number": "D224816584"
        }
      },
      {
        "plate_number": "SG-6609",
        "truck_id": "TRK137",
        "model": "Isuzu N-Series",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV586",
          "name": "Nimal Silva",
          "contact_number": "+94 792698734",
          "license_number": "D369368075"
        }
      },
      {
        "plate_number": "NW-9769",
        "truck_id": "TRK138",
        "model": "BharatBenz 1217C",
        "status": {
          "current_location": {
            "latitude": 6.9271,
            "longitude": 79.8612,
            "location_name": "Colombo Fort",
            "timestamp": "2025-05-08T13:14:00Z"
          },
          "location_history": [
            {
              "latitude": 6.9251,
              "longitude": 79.8592,
              "location_name": "Slave Island",
              "timestamp": "2025-05-08T13:09:00Z"
            },
            {
              "latitude": 6.9231,
              "longitude": 79.8572,
              "location_name": "Kollupitiya",
              "timestamp": "2025-05-08T13:04:00Z"
            }
          ]
        },
        "driver": {
          "driver_id": "DRV239",
          "name": "Sajith Perera",
          "contact_number": "+94 713243112",
          "license_number": "D624332021"
        }
      }
    ];

    // Find the truck with the matching ID
    const foundTruck = truckDetailsArray.find(
      (truck) => truck.truck_id === truckId
    );

    // If found, return that truck's details, otherwise return a default or error
    if (foundTruck) {
      return of(foundTruck);
    } else {
      // You could handle the "not found" case differently if needed
      // For example, return an error Observable:
      // return throwError(() => new Error(`Truck with ID ${truckId} not found`));

      // For now, return the first truck as a fallback (you might want to change this)
      console.warn(
        `Truck with ID ${truckId} not found, returning first available truck`
      );
      return of(truckDetailsArray[0]);
    }
  }
}
