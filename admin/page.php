<!DOCTYPE html>
<html lang="ru" class="auth">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<title>Bitmexbot panel by Kirill Milano</title>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">

<script>
    document.secret_seed = "<?php echo string2normal($input_secret)?>";
    document.bot_id = "<?php echo string2normal($input_bot_id)?>";
</script>
<script language="javascript" type="text/javascript" src="script.js"></script>
<link rel="stylesheet" href="style.css" type="text/css" media="screen" />


</head>
<body>

<div id="wrapper">
    <form action="" method="post" id="settings_form" enctype="multipart/form-data">
        <div id="settings">
            <div>
                <div class="title">Текущая сессия</div>
                <div class="value">
                    <div>Статус: <?php echo $profile['status'] ? 'Работает' : 'Остановлено'; ?></div>
                    <?php if ($profile['status']) { ?>
                    <div>ID: <?php echo $profile['session_id']; ?></div>
                    <div>Время запуска: <?php echo rusdate($profile['session_start_time']); ?></div>
                    <div>Последний пинг бота: <?php echo $profile['last_ping_time'] == 0 ? 'нет' : rusdate($profile['last_ping_time']); ?></div>
                    <?php } ?>
                </div>
            </div>
            <div>
                <div class="title">Сервер</div>
                <div class="value">
                    <input type="text" name="server" value="<?php echo string2normal($profile['server']); ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Api key id</div>
                <div class="value">
                    <input type="text" name="api_key_id" value="<?php echo string2normal($profile['api_key_id']); ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Api key secret</div>
                <div class="value">
                    <input type="text" name="api_key_secret" value="<?php echo string2normal($profile['api_key_secret']); ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Средняя цена для расчетов в $</div>
                <div class="value">
                    <input type="text" name="session_start_price" value="<?php echo $profile['session_start_price']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Модификатор цены для защиты в $</div>
                <div class="value">
                    <input type="text" name="price_modifier" value="<?php echo $profile['price_modifier']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Минимальная расстояние в $ от средней цены для открытия сделки</div>
                <div class="value">
                    <input type="text" name="price_reserve_value" value="<?php echo $profile['price_reserve_value']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Максимальный объем депозита для работы боту в XBT</div>
                <div class="value">
                    <input type="text" name="max_amount" value="<?php echo $profile['max_amount']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Коэффициент объема сделки для позиции x100</div>
                <div class="value">
                    <input type="text" name="main_pos_cof_x100" value="<?php echo $profile['main_pos_cof_x100']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Коэффициент объема сделки для позиции x50</div>
                <div class="value">
                    <input type="text" name="main_pos_cof_x50" value="<?php echo $profile['main_pos_cof_x50']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Коэффициент объема сделки для позиции x25</div>
                <div class="value">
                    <input type="text" name="main_pos_cof_x25" value="<?php echo $profile['main_pos_cof_x25']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Коэффициент объема сделки для позиции x10</div>
                <div class="value">
                    <input type="text" name="main_pos_cof_x10" value="<?php echo $profile['main_pos_cof_x10']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Коэффициент объема сделки для позиции x5</div>
                <div class="value">
                    <input type="text" name="main_pos_cof_x5" value="<?php echo $profile['main_pos_cof_x5']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Коэффициент объема сделки для позиции x3</div>
                <div class="value">
                    <input type="text" name="main_pos_cof_x3" value="<?php echo $profile['main_pos_cof_x3']; ?>" autocomplete="off">
                </div>
            </div>
            <div>
                <div class="title">Коэффициент объема сделки для позиции x2</div>
                <div class="value">
                    <input type="text" name="main_pos_cof_x2" value="<?php echo $profile['main_pos_cof_x2']; ?>" autocomplete="off">
                </div>
            </div>
        </div>
        <div id="settings_save">
            <div><a href="javascript://" class="save" onclick="document.process.start(); return false;">Обновить и запустить новую сессию<br> (все сделки перед перезапуском будут закрыты принудительно)</a></div>
            <?php if ($profile['status']) { ?>
            <div><a href="javascript://" class="stop" onclick="document.process.stop(); return false;">Остановить сессию<br> (все сделки будут закрыты принудительно)</a></div>
            <?php } ?>
        </div>
    </form>
</div>

</body>
</html>