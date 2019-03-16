<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="dist/style.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <title>Category Filter</title>
</head>
<body>
    <script src="dist/bundle.js"></script>
    <div class="body-wrapper">
        <div class="filter-wrapper">
            <div class="form-group form-group--search">
                <form class="form-group__form"> 
                    <div class="form-group__form__search-icon"><i class="fas fa-search"></i></div>
                    <input class="form-group__form__input-field" type="text" name="category" autocomplete="off" placeholder="Search Categories">
                </form>
            </div>
            <div class="data-container">
                <ul class="data-container__list"></ul>
                <div class="data-container__controls data-container__controls--hidden">
                    <button class="btn__filter" id="data-container__list__button--cancel"><span>Cancel</span></button>
                    <button class="btn__filter" id="data-container__list__button--apply"><i class="fas fa-check apply-icon"></i><span>APPLY</span></button>
                </div>
            </div>
        </div>
        <div class="selection-container"></div>
        <div class="selection-container__list">
        </div>
    </div>
</ul>
</body>
</html>