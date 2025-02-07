# API для расчета стоимости 3D-печати по STL-модели

Этот проект предоставляет API на базе Node.js для расчета стоимости 3D-печати по загруженному `.stl` файлу. Приложение анализирует геометрию модели, рассчитывает объем, вес и стоимость с учетом типа пластика и заданной наценки.

---

## Особенности

- **Анализ STL файлов**: Извлечение размеров, объема и веса из загруженной модели.
- **Динамическое ценообразование**: Поддержка изменения цены за материал и наценки.
- **Поддержка различных материалов**: Настраиваемая база плотностей для разных пластиков (расположена в директории `services/json`).
- **Обработка ошибок**: Четкие сообщения об ошибках при отсутствии или неверных данных.

---

## Установка

1. Склонируйте репозиторий:
   ```bash
   git clone https://github.com/Ilvif666/stl_tryouts.git
   cd stl_tryouts
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Убедитесь, что файлы с плотностями и ценами материалов находится в `services/json`. Настройте плотности и поддерживаемые типы пластика при необходимости.
- density.json
   ```json
   {
    "PLA": 1.255,
    "ABS": 1.055,
    "PETG": 1.305,
    "TPU": 1.225,
    "Nylon": 1.14,
    "SBS": 1.035,
    "HIPS": 1.05
   }
   ```
- filament_price.json
   ```json
   {
    "PLA": 1255,
    "ABS": 1055,
    "PETG": 1305,
    "TPU": 1225,
    "Nylon": 1140,
    "SBS": 1035,
    "HIPS": 1050
   }
   ```
---

## Запуск приложения

Для запуска доступны два режима:

1. **Обычный режим**:
   ```bash
   npm start
   ```

2. **Режим разработки** (с автоматической перезагрузкой при изменениях):
   ```bash
   npm run dev
   ```

После запуска сервер будет доступен по адресу: `http://localhost:3000`.

---

## Использование API

### POST `/`

Эндпоинт для загрузки `.stl` файла и расчета стоимости.

#### Тело запроса (form-data)
| Поле     | Тип    | Описание                                                                                                             |
| -------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| `file`   | File   | Файл формата `.stl` для анализа.                                                                                     |
| `price`  | Number | Цена за килограмм пластика в рублях. Можно опустить, если в filament_price.json указана цена для этого type пластика |
| `margin` | Number | (Опционально) Наценка в процентах.                                                                                   |
| `type`   | String | Тип пластика (например, PLA, ABS, PETG).                                                                             |


#### Пример ответа
- **200 OK**:
  ```json
  {
    "width": 81,        мм
    "height": 45,       мм
    "depth": 17,        мм
    "volume": 6665,     мм^3
    "weight": 8.36,     г
    "price": 33.44 
  }
  ```
- **500 Internal Server Error**:
  Сообщение с описанием ошибки.

### POST `/many`

Эндпоинт для загрузки множественных `.stl` файлов и расчета стоимости.

#### Пример ответа
- **200 OK**:
  ```json
  {
    "filesCount": 49,
    "plasticType": "PETG",
    "totalVolume": 3161998,
    "totalWeight": 4126.34,
    "totalPrice": 17388.380000000005,
    "details": [
        {
            "filename": "Sails_-_Top_-_Crows_Nest_-_Center.stl",
            "linearDims": {
                "width": 171.32,
                "height": 59.86,
                "depth": 133.24
            },
            "volume": 52780,
            "weight": 68.88,
            "price": 290.26
        },
        {
            "filename": "Sails_-_Lower_Sail_-_Center_-_Has_Ladder.stl",
            "linearDims": {
                "width": 188.41,
                "height": 44.1,
                "depth": 117.65
            },
            "volume": 74923,
            "weight": 97.77,
            "price": 412
        },
        {
            "filename": "Sails_-_Lower_Sail_-_Rear_Front.stl",
            "linearDims": {
                "width": 188.41,
                "height": 42.78,
                "depth": 117.65
            },
            "volume": 73137,
            "weight": 95.44,
            "price": 402.18
        },
        {
            "filename": "Sails_-_Top.stl",
            "linearDims": {
                "width": 157.78,
                "height": 34.75,
                "depth": 134.65
            },
            "volume": 41360,
            "weight": 53.97,
            "price": 227.43
        },
        {
            "filename": "Mid_Deck_-_Center_-_Stairs.stl",
            "linearDims": {
                "width": 169.4,
                "height": 55.22,
                "depth": 65.04
            },
            "volume": 138821,
            "weight": 181.16,
            "price": 763.41
        },
        {
            "filename": "Galleon_-_Captains_Quarters3_fixed.stl",
            "linearDims": {
                "width": 136.75,
                "height": 97.79,
                "depth": 104.6
            },
            "volume": 261588,
            "weight": 341.37,
            "price": 1438.53
        },
        {
            "filename": "Lower_Deck_-_Front_1.stl",
            "linearDims": {
                "width": 137.72,
                "height": 123.45,
                "depth": 62.97
            },
            "volume": 133942,
            "weight": 174.79,
            "price": 736.57
        },
        {
            "filename": "Gangplank_-_with_notches.stl",
            "linearDims": {
                "width": 116.27,
                "height": 26.08,
                "depth": 5.12
            },
            "volume": 9490,
            "weight": 12.38,
            "price": 52.17
        },
        {
            "filename": "Gangplank_-_plain.stl",
            "linearDims": {
                "width": 103.79,
                "height": 25.87,
                "depth": 5.12
            },
            "volume": 8757,
            "weight": 11.43,
            "price": 48.17
        },
        {
            "filename": "Galleon_-_Captains_Quarters.stl",
            "linearDims": {
                "width": 166.01,
                "height": 50.92,
                "depth": 83.13
            },
            "volume": 118177,
            "weight": 154.22,
            "price": 649.88
        },
        {
            "filename": "Kitchen_Door.stl",
            "linearDims": {
                "width": 48.75,
                "height": 9.75,
                "depth": 48.7
            },
            "volume": 6896,
            "weight": 9,
            "price": 37.93
        },
        {
            "filename": "Helm2.stl",
            "linearDims": {
                "width": 131.09,
                "height": 75.05,
                "depth": 29.29
            },
            "volume": 116379,
            "weight": 151.87,
            "price": 639.98
        },
        {
            "filename": "Mid_Deck_Window.stl",
            "linearDims": {
                "width": 2.16,
                "height": 16.59,
                "depth": 16.9
            },
            "volume": 310,
            "weight": 0.4,
            "price": 1.69
        },
        {
            "filename": "Helm.stl",
            "linearDims": {
                "width": 152.4,
                "height": 86.5,
                "depth": 21.65
            },
            "volume": 105987,
            "weight": 138.31,
            "price": 582.84
        },
        {
            "filename": "Galleon_-_Top_-_Stairs_and_Door.stl",
            "linearDims": {
                "width": 165.92,
                "height": 51.5,
                "depth": 78.85
            },
            "volume": 182126,
            "weight": 237.67,
            "price": 1001.54
        },
        {
            "filename": "Captain_Door.stl",
            "linearDims": {
                "width": 36.42,
                "height": 7.69,
                "depth": 48.54
            },
            "volume": 4542,
            "weight": 5.93,
            "price": 24.99
        },
        {
            "filename": "Galleon_-_Top_-_Nose3.stl",
            "linearDims": {
                "width": 149.78,
                "height": 50.85,
                "depth": 31.87
            },
            "volume": 103212,
            "weight": 134.69,
            "price": 567.58
        },
        {
            "filename": "Galleon_-_Top_-_Deck_with_Mast.stl",
            "linearDims": {
                "width": 167.57,
                "height": 50.84,
                "depth": 26.16
            },
            "volume": 73250,
            "weight": 95.59,
            "price": 402.82
        },
        {
            "filename": "Galleon_-_Top_-_Deck.stl",
            "linearDims": {
                "width": 167.57,
                "height": 50.84,
                "depth": 22.99
            },
            "volume": 68652,
            "weight": 89.59,
            "price": 377.53
        },
        {
            "filename": "Galleon_-_Top_-_Nose4.stl",
            "linearDims": {
                "width": 165.88,
                "height": 50.84,
                "depth": 25.28
            },
            "volume": 71190,
            "weight": 92.9,
            "price": 391.48
        },
        {
            "filename": "Lower_Deck_-_Rear_2.stl",
            "linearDims": {
                "width": 136.93,
                "height": 121.89,
                "depth": 62.99
            },
            "volume": 129917,
            "weight": 169.54,
            "price": 714.44
        },
        {
            "filename": "Galleon_-_Captains_Quarters2_fixed.stl",
            "linearDims": {
                "width": 151.19,
                "height": 50.98,
                "depth": 87.42
            },
            "volume": 97525,
            "weight": 127.27,
            "price": 536.32
        },
        {
            "filename": "Lower_Deck_-_Rear_1.stl",
            "linearDims": {
                "width": 152.58,
                "height": 52.18,
                "depth": 62.97
            },
            "volume": 76715,
            "weight": 100.11,
            "price": 421.86
        },
        {
            "filename": "Stairs_for_Gangplank_and_Ropeladder.stl",
            "linearDims": {
                "width": 32.8,
                "height": 18.21,
                "depth": 20.83
            },
            "volume": 3588,
            "weight": 4.68,
            "price": 19.72
        },
        {
            "filename": "Galleon_-_Top_-_Grate_or_Stairs.stl",
            "linearDims": {
                "width": 167.57,
                "height": 50.84,
                "depth": 22.99
            },
            "volume": 57964,
            "weight": 75.64,
            "price": 318.75
        },
        {
            "filename": "Lower_Deck_-_Center_-_Pillar.stl",
            "linearDims": {
                "width": 152.58,
                "height": 50.79,
                "depth": 62.97
            },
            "volume": 79392,
            "weight": 103.61,
            "price": 436.61
        },
        {
            "filename": "Mid_Deck_-_Front_1.stl",
            "linearDims": {
                "width": 169.4,
                "height": 50.83,
                "depth": 63.12
            },
            "volume": 92166,
            "weight": 120.28,
            "price": 506.86
        },
        {
            "filename": "Lower_Deck_-_Front_2.stl",
            "linearDims": {
                "width": 152.58,
                "height": 50.83,
                "depth": 62.97
            },
            "volume": 75837,
            "weight": 98.97,
            "price": 417.06
        },
        {
            "filename": "Lower_Deck_-_Center_-_No_Pillar.stl",
            "linearDims": {
                "width": 152.58,
                "height": 50.79,
                "depth": 62.97
            },
            "volume": 73035,
            "weight": 95.31,
            "price": 401.64
        },
        {
            "filename": "Mid_Deck_-_Rear_2.stl",
            "linearDims": {
                "width": 151.73,
                "height": 50.84,
                "depth": 63.14
            },
            "volume": 93007,
            "weight": 121.37,
            "price": 511.45
        },
        {
            "filename": "Mid_Deck_-_Center_-_With_Window.stl",
            "linearDims": {
                "width": 169.4,
                "height": 50.85,
                "depth": 63.11
            },
            "volume": 89544,
            "weight": 116.85,
            "price": 492.41
        },
        {
            "filename": "Galleon_-_Top_-_Nose2.stl",
            "linearDims": {
                "width": 117.71,
                "height": 51.05,
                "depth": 31.87
            },
            "volume": 96382,
            "weight": 125.78,
            "price": 530.04
        },
        {
            "filename": "Mid_Deck_-_Front_2.stl",
            "linearDims": {
                "width": 153.86,
                "height": 50.84,
                "depth": 63.11
            },
            "volume": 66495,
            "weight": 86.78,
            "price": 365.69
        },
        {
            "filename": "Mid_Deck_-_Kitchen.stl",
            "linearDims": {
                "width": 134.1,
                "height": 97.96,
                "depth": 63.15
            },
            "volume": 139811,
            "weight": 182.45,
            "price": 768.84
        },
        {
            "filename": "Mid_Deck_-_Front_3.stl",
            "linearDims": {
                "width": 122.45,
                "height": 95.91,
                "depth": 63.12
            },
            "volume": 77962,
            "weight": 101.74,
            "price": 428.73
        },
        {
            "filename": "Mid_Deck_-_Center_-_With_Window_and_Mast_Support.stl",
            "linearDims": {
                "width": 169.4,
                "height": 50.85,
                "depth": 63.11
            },
            "volume": 93181,
            "weight": 121.6,
            "price": 512.42
        },
        {
            "filename": "Mid_Deck_-_Rear_1.stl",
            "linearDims": {
                "width": 169.39,
                "height": 50.84,
                "depth": 63.11
            },
            "volume": 89199,
            "weight": 116.4,
            "price": 490.51
        },
        {
            "filename": "Galleon_-_Top_-_Nose.stl",
            "linearDims": {
                "width": 64.27,
                "height": 169.8,
                "depth": 59.65
            },
            "volume": 42766,
            "weight": 55.81,
            "price": 235.18
        },
        {
            "filename": "Kichen_Shelf_-_Top.stl",
            "linearDims": {
                "width": 56.7,
                "height": 8.9,
                "depth": 8.46
            },
            "volume": 390,
            "weight": 0.51,
            "price": 2.15
        },
        {
            "filename": "Capstain.stl",
            "linearDims": {
                "width": 35.08,
                "height": 35.08,
                "depth": 22.46
            },
            "volume": 2442,
            "weight": 3.19,
            "price": 13.44
        },
        {
            "filename": "Ropeladder_Center_Pieces.stl",
            "linearDims": {
                "width": 26.46,
                "height": 23.85,
                "depth": 10.99
            },
            "volume": 753,
            "weight": 0.98,
            "price": 4.13
        },
        {
            "filename": "Grate.stl",
            "linearDims": {
                "width": 54.7,
                "height": 41.2,
                "depth": 2.29
            },
            "volume": 2515,
            "weight": 3.28,
            "price": 13.82
        },
        {
            "filename": "Ropeladder_Top.stl",
            "linearDims": {
                "width": 25.38,
                "height": 23.55,
                "depth": 10.99
            },
            "volume": 379,
            "weight": 0.49,
            "price": 2.06
        },
        {
            "filename": "Mast_-_Lower_-_With_Ladder.stl",
            "linearDims": {
                "width": 14.7,
                "height": 17.38,
                "depth": 105.84
            },
            "volume": 14785,
            "weight": 19.29,
            "price": 81.29
        },
        {
            "filename": "Ropeladder_Bottom.stl",
            "linearDims": {
                "width": 22.42,
                "height": 23.85,
                "depth": 8.52
            },
            "volume": 627,
            "weight": 0.82,
            "price": 3.46
        },
        {
            "filename": "Kitchen_Shelf_-_Bottom.stl",
            "linearDims": {
                "width": 59.37,
                "height": 11.35,
                "depth": 2.85
            },
            "volume": 590,
            "weight": 0.77,
            "price": 3.24
        },
        {
            "filename": "Tile_layout_iteration_3-ODT_openLock_nub.stl",
            "linearDims": {
                "width": 13.86,
                "height": 14.86,
                "depth": 3.01
            },
            "volume": 375,
            "weight": 0.49,
            "price": 2.06
        },
        {
            "filename": "Mast_-_Lower.stl",
            "linearDims": {
                "width": 14.7,
                "height": 14.7,
                "depth": 105.84
            },
            "volume": 13971,
            "weight": 18.23,
            "price": 76.82
        },
        {
            "filename": "Mast_-_Rear.stl",
            "linearDims": {
                "width": 14.7,
                "height": 14.7,
                "depth": 39.83
            },
            "volume": 5166,
            "weight": 6.74,
            "price": 28.4
        }
    ]
}
  ```
- **500 Internal Server Error**:
  Сообщение с описанием ошибки.

---

## Структура проекта

```
.
├── controllers
│   └── stlController.js   # Логика обработки файлов и расчета.
├── routes
│   └── index.js       # Определение маршрутов API.
├── services
│   ├── stlService.js      # Обработка STL-файлов и вычисления.
│   ├── weightService.js   # Расчеты веса и плотности материалов.
│   ├── priceService.js    # Расчеты стоимости.
│   └── json               # Файлы плотностей и поддерживаемых пластиков.
├── uploads                # Временное хранилище загруженных файлов.
├── bin
│   └── www                # Точка входа для сервера.
├── package.json           # Метаданные проекта и зависимости.
└── README.md              # Документация.
```

---

## Тестирование

Для тестирования API вы можете использовать инструменты, такие как Postman или cURL. Убедитесь, что `.stl` файл добавлен в запрос в формате `form-data`.

---

## Ссылка на репозиторий

Репозиторий проекта доступен по ссылке: [https://github.com/Ilvif666/stl_tryouts](https://github.com/Ilvif666/stl_tryouts).

---

## Лицензия

Проект распространяется под лицензией MIT.
