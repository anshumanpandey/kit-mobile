export interface Project {
    id:                      number;
    title:                   string;
    status:                  string;
    pickup_date:             string;
    shipping_date:           string;
    start_date:              string;
    end_date:                string;
    expected_return_date:    string;
    organisation_id:         number;
    created_by:              number;
    updated_by:              number;
    created_at:              string;
    updated_at:              string;
    cron:                    string;
    user:                    number;
    client_name:             string;
    client_contact_number:   string;
    location:                string;
    tracking_number:         null;
    incoming_shipping_crate: null;
    outgoing_shipping_crate: null;
    project_status:          string;
    with_subitems:           WithSubitem[];
}

export interface WithSubitem {
    id:                     number;
    serialnumber:           string;
    pictureurl:             string;
    date_of_purchase:       string;
    warranty_expiry_period: string;
    quantity:               number;
    latitude:               string;
    longitude:              string;
    barcode_no:             string;
    barcode_url:            string;
    receipt_url:            string;
    condition:              string;
    status:                 string;
    notes:                  string;
    item_id:                number;
    organisation_id:        number;
    created_by:             number;
    updated_by:             number;
    created_at:             string;
    updated_at:             string;
    available_qty:          null;
    disposed:               string;
    make:                   string;
    model:                  string;
    pivot:                  Pivot;
}

export interface Pivot {
    project_id: number;
    item_id:    number;
    quantity:   string;
}
