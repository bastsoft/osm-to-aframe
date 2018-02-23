const Conv = ({

    r_major: 6378137.0,//Equatorial Radius, WGS84
    r_minor: 6356752.314245179,//defined as constant
    f: 298.257223563,//1/f=(a-b)/a , a=r_major, b=r_minor

    deg2rad: function (d) {
        return d * (Math.PI / 180.0);
    },

    rad2deg: function (r) {
        return r / (Math.PI / 180.0);
    },

    ll2m: function (lon, lat) //lat lon to mercator
    {
        if (lat > 89.5) lat = 89.5;
        if (lat < -89.5) lat = -89.5;

        const temp = this.r_minor / this.r_major;
        const es = 1.0 - (temp * temp);
        const eccent = Math.sqrt(es);
        const phi = this.deg2rad(lat);
        const sinphi = Math.sin(phi);
        const con = eccent * sinphi;
        const com = .5 * eccent;
        const con2 = Math.pow((1.0 - con) / (1.0 + con), com);
        const ts = Math.tan(.5 * (Math.PI * 0.5 - phi)) / con2;

        return {
            'x': this.r_major * this.deg2rad(lon),
            'y': 0 - this.r_major * Math.log(ts)
        };
    },
    m2ll: function (x, y) //mercator to lat lon
    {
        const temp = this.r_minor / this.r_major;
        const e = Math.sqrt(1.0 - (temp * temp));

        return {
            'lon': this.rad2deg((x / this.r_major)),
            'lat': this.rad2deg(this.pj_phi2(Math.exp(0 - (y / this.r_major)), e))
        };
    },
    pj_phi2: function (ts, e) {
        let i = 15;
        const HALFPI = Math.PI / 2;
        const TOL = 0.0000000001;
        const eccnth = .5 * e;
        let Phi = HALFPI - 2. * Math.atan(ts);
        let dphi;

        do {
            const con = e * Math.sin(Phi);
            dphi = HALFPI - 2. * Math.atan(ts * Math.pow((1. - con) / (1. + con), eccnth)) - Phi;

            Phi += dphi;
        }
        while (Math.abs(dphi) > TOL && --i);

        return Phi;
    }
});

const getBbox = function (lon, lat, radius) {
    radius = Number(radius);
    const point = Conv.ll2m(lon, lat);
    const point1 = Conv.m2ll(point.x - radius, point.y - radius);
    const point2 = Conv.m2ll(point.x + radius, point.y + radius);

    return {
        leftLon: point1.lon,
        bottomLat: point1.lat,
        rightLon: point2.lon,
        topLat: point2.lat
    };
};

export {
    Conv as converterMercator,
    getBbox
};