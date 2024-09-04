import React, {SyntheticEvent, useEffect, useState} from 'react';
import {RadioBrowserApi} from "radio-browser-api";
import H5AudioPlayer, {RHAP_UI} from "react-h5-audio-player";
import defaultImage from "./images/radio-icon.jpg"

const Radio = () => {

    const [stations, setStations] = useState<any>()
    const [stationFilter, setStationFilter] = useState('all')

    useEffect(() => {
        setupApi(stationFilter).then((data) => {

            setStations(data)
        })
    }, [stationFilter])

    const setupApi = async (stationFilter: string) => {

        // @ts-ignore
        const api = new RadioBrowserApi(fetch.bind(window), 'My Radio')

        const stations = await api.searchStations({
            language: "russian",
            tag: stationFilter,
            limit: 30
        })
            .then((data) => {
                return data
            })
        return stations
    }

    const filters = [
        "all",
        "classical",
        "country",
        "dance",
        "disco",
        "house",
        "jazz",
        "pop",
        "rap",
        "retro",
        "rock"
    ];

    const seDefaultSrc = (event: SyntheticEvent<HTMLImageElement>) => {
        event.currentTarget.src = defaultImage
    }

    return (
        <div className="radio">
            <div className="filters">
                {filters.map(filter => {
                    return <span className={stationFilter === filter ? "selected" : ''}
                                 onClick={() => setStationFilter(filter)}>{filter}</span>
                })}
            </div>
            <div className="stations">
                {stations &&
                    stations.map((station: {
                        favicon: string | undefined;
                        name: string | undefined;
                        urlResolved: string | undefined;
                    }, index: React.Key | null | undefined) => {

                        return (
                            <div onClick={()=> alert('')} className="station" key={index}>
                                <div className="stationName">
                                    <img
                                        className="logo"
                                        src={station.favicon}
                                        onError={seDefaultSrc}
                                    />
                                    <div className="name"> {station.name} </div>
                                </div>

                                <H5AudioPlayer
                                    className="player"
                                    src={station.urlResolved}
                                    showJumpControls={false}
                                    layout="stacked"
                                    customProgressBarSection={[]}
                                    customControlsSection={[RHAP_UI.MAIN_CONTROLS,  RHAP_UI.VOLUME_CONTROLS]}
                                   // customVolumeControls={[RHAP_UI.VOLUME]}
                                    autoPlayAfterSrcChange={false}
                                    showFilledVolume={true}
                                />
                            </div>
                        )
                    })}
            </div>
        </div>
    );
};

export default Radio;