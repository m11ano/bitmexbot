<?php

function get_rus_month($m)
{
	$months = array(
		'01'=>'января',
		'02'=>'февраля',
		'03'=>'марта',
		'04'=>'апреля',
		'05'=>'мая',
		'06'=>'июня',
		'07'=>'июля',
		'08'=>'августа',
		'09'=>'сентября',
		'10'=>'октября',
		'11'=>'ноября',
		'12'=>'декабря'
	);
	return $months[$m];
}


function rusdate($time)
{
	if (strtotime(date('d-m-Y', time())) - strtotime(date('d-m-Y', $time)) == 0) {
		return 'Сегодня, в '.date('H:i', $time);
	} else if (strtotime(date('d-m-Y', time())) - strtotime(date('d-m-Y', $time)) == 3600*24) {
		return 'Вчера, в '.date('H:i', $time);
	} else if (strtotime(date('Y', time())) == strtotime(date('Y', $time))) {
		return date('d', $time).' '.get_rus_month(date('m', $time)).', в '.date('H:i', $time);
	} else {
		return date('d', $time).' '.get_rus_month(date('m', $time)).' '.date('Y', $time).', в '.date('H:i', $time);
	}
}


function string2normal($text) {

	$text = htmlspecialchars($text, ENT_QUOTES, 'utf-8');
	$text = trim(str_replace('&amp;', '&', $text));
	$text = str_replace("'", "&rsquo;", $text);
	return $text;
}

function get_https($url, $https = true, $post_str = false, $timeout = false)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt($ch, CURLOPT_USERAGENT, 'PHP');
	if ($https == true)
	{
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	}
	if ($post_str !== false)
	{
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post_str);
	}
	$data = curl_exec($ch);
	curl_close($ch);
	return $data;
}



?>