import React, {useState, useEffect} from 'react';
import {getDistance} from 'geolib';

const metroStations = [
    {name: 'Академгородок', line: 'red', latitude: 50.464883, longitude: 30.355075},
    {name: 'Житомирская', line: 'red', latitude: 50.45564, longitude: 30.379585},
    {name: 'Святошин', line: 'red', latitude: 50.457956, longitude: 30.391834},
    {name: 'Нивки', line: 'red', latitude: 50.457611, longitude: 30.417236},
    {name: 'Берестейская', line: 'red', latitude: 50.454727, longitude: 30.429754},
    {name: 'Шулявская', line: 'red', latitude: 50.454294, longitude: 30.445123},
    {name: 'Политехнический институт', line: 'red', latitude: 50.450677, longitude: 30.466493},
    {name: 'Вокзальная', line: 'red', latitude: 50.441031, longitude: 30.488465},
    {name: 'Университет', line: 'red', latitude: 50.444216, longitude: 30.506067},
    {name: 'Театральная', line: 'red', latitude: 50.445296, longitude: 30.516423},
    {name: 'Хрещатик', line: 'red', latitude: 50.447529, longitude: 30.522968},
    {name: 'Арсенальная', line: 'red', latitude: 50.444549, longitude: 30.545724},
    {name: 'Днепр', line: 'red', latitude: 50.439221, longitude: 30.555099},
    {name: 'Гидропарк', line: 'red', latitude: 50.445972, longitude: 30.576673},
    {name: 'Левобережная', line: 'red', latitude: 50.45191, longitude: 30.592637},
    {name: 'Дарница', line: 'red', latitude: 50.459051, longitude: 30.613278},
    {name: 'Черниговская', line: 'red', latitude: 50.460696, longitude: 30.630842},
    {name: 'Лесная', line: 'red', latitude: 50.464848, longitude: 30.650923},
    {name: 'Героев Днепра', line: 'blue', latitude: 50.522344, longitude: 30.498798},
    {name: 'Минская', line: 'blue', latitude: 50.511059, longitude: 30.498134},
    {name: 'Оболонь', line: 'blue', latitude: 50.501435, longitude: 30.498779},
    {name: 'Петровка', line: 'blue', latitude: 50.487969, longitude: 30.498451},
    {name: 'Тараса Шевченко', line: 'blue', latitude: 50.473137, longitude: 30.504163},
    {name: 'Контрактовая площадь', line: 'blue', latitude: 50.465067, longitude: 30.519021},
    {name: 'Почтовая площадь', line: 'blue', latitude: 50.459377, longitude: 30.524643},
    {name: 'Майдан Независимости', line: 'blue', latitude: 50.450053, longitude: 30.523337},
    {name: 'Площадь Льва Толстого', line: 'blue', latitude: 50.439222, longitude: 30.516629},
    {name: 'Олимпийская', line: 'blue', latitude: 50.433877, longitude: 30.516145},
    {name: 'Дворец "Украина"', line: 'blue', latitude: 50.425159, longitude: 30.520977},
    {name: 'Лыбедская', line: 'blue', latitude: 50.413835, longitude: 30.524659},
    {name: 'Демеевская', line: 'blue', latitude: 50.404992, longitude: 30.517381},
    {name: 'Голосеевская', line: 'blue', latitude: 50.393404, longitude: 30.510087},
    {name: 'Васильковская', line: 'blue', latitude: 50.379716, longitude: 30.487684},
    {name: 'Выставочный центр', line: 'blue', latitude: 50.379092, longitude: 30.472032},
    {name: 'Ипподром', line: 'blue', latitude: 50.381968, longitude: 30.459191},
    {name: 'Теремки', line: 'blue', latitude: 50.373456, longitude: 30.45475},
    {name: 'Сырец', line: 'green', latitude: 50.477246, longitude: 30.430392},
    {name: 'Дорогожичи', line: 'green', latitude: 50.471619, longitude: 30.447326},
    {name: 'Лукьяновская', line: 'green', latitude: 50.462772, longitude: 30.466184},
    {name: 'Золотые Ворота', line: 'green', latitude: 50.448779, longitude: 30.513524},
    {name: 'Дворец спорта', line: 'green', latitude: 50.437784, longitude: 30.521712},
    {name: 'Кловская', line: 'green', latitude: 50.427774, longitude: 30.537265},
    {name: 'Печерская', line: 'green', latitude: 50.418817, longitude: 30.545587},
    {name: 'Дружбы народов', line: 'green', latitude: 50.418246, longitude: 30.54568},
    {name: 'Выдубичи', line: 'green', latitude: 50.40152, longitude: 30.560122},
    {name: 'Теличка', line: 'green', latitude: 50.387382, longitude: 30.567085},
    {name: 'Славутич', line: 'green', latitude: 50.370735, longitude: 30.616492},
    {name: 'Осокорки', line: 'green', latitude: 50.395118, longitude: 30.633157},
    {name: 'Позняки', line: 'green', latitude: 50.403572, longitude: 30.633527},
    {name: 'Харьковская', line: 'green', latitude: 50.400886, longitude: 30.652819},
    {name: 'Вырлица', line: 'green', latitude: 50.403407, longitude: 30.666212},
    {name: 'Бориспольская', line: 'green', latitude: 50.403567, longitude: 30.684058}
];


export const MetroLocator = () => {
    const [stationInfo, setStationInfo] = useState(null);

    useEffect(() => {
        const updateLocation = () => {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                const nearestStations = metroStations.map(station => ({
                    ...station,
                    distance: getDistance(userLocation, station)
                })).sort((a, b) => a.distance - b.distance);

                const first = nearestStations[0];
                const second = nearestStations[1];

                if (first.distance < 200) {
                    setStationInfo({
                        type: 'station',
                        name: first.name,
                        line: first.line,
                    });
                } else if (first.distance < 500 && second.distance < 500) {
                    setStationInfo({
                        type: 'between',
                        first: first.name,
                        second: second.name,
                    });
                } else {
                    setStationInfo({type: 'none'});
                }
            });
        };

        updateLocation(); // вызовите сразу при загрузке
        const intervalId = setInterval(updateLocation, 5000); // обновлять каждые 5 секунд

        return () => clearInterval(intervalId); // очистить интервал при размонтировании компонента
    }, []);

    return (
        <div>
            {stationInfo && (
                <div>
                    {stationInfo.type === 'station' && (
                        <span style={{color: stationInfo.line}}>
              Вы находитесь на станции {stationInfo.name}
            </span>
                    )}
                    {stationInfo.type === 'between' && (
                        <span>
              Вы находитесь между станциями {stationInfo.first} и {stationInfo.second}
            </span>
                    )}
                    {stationInfo.type === 'none' && (
                        <span>Вы находитесь не в метро</span>
                    )}
                </div>
            )}
        </div>
    );
};