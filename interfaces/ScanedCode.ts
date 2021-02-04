export interface ScannedCode {
    bounds:        Bounds;
    format:        string;
    dataRaw:       string;
    type:          string;
    data:          string;
    forCheckState: number;
}

export interface Bounds {
    size:   Size;
    origin: Origin;
}

export interface Origin {
    y: number;
    x: number;
}

export interface Size {
    height: number;
    width:  number;
}
