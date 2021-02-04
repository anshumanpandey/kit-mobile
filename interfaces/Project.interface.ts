export interface Project {
    id:                   number;
    title:                string;
    status:               string;
    pickup_date:          string;
    shipping_date:        string;
    start_date:           string;
    end_date:             string;
    expected_return_date: string;
    organisation_id:      number;
    created_by:           number;
    updated_by:           number;
    created_at:           string;
    updated_at:           string;
    cron:                 string;
    project_status:       string;
    with_subitems:        WithSubitem[];
    project_barcodes:     any[];
}

export interface WithSubitem {
    id:                     number;
    serialnumber:           string;
    pictureurl:             string;
    date_of_purchase:       Date;
    warranty_expiry_period: Date;
    quantity:               number;
    receipt_url:            string;
    condition:              string;
    status:                 string;
    notes:                  string;
    item_id:                number;
    organisation_id:        number;
    created_by:             number;
    updated_by:             number;
    created_at:             Date;
    updated_at:             Date;
    pivot:                  Pivot;
}

export interface Pivot {
    project_id: number;
    item_id:    number;
    quantity:   string;
}