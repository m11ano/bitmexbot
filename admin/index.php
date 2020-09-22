<?php

$way = pos(pathinfo($_SERVER['SCRIPT_FILENAME'])).'/';
define('way', $way);

require_once way.'includes/config.php';
require_once way.'includes/db.class.php';
require_once way.'includes/functions.php';

$db = new Database();
$db->initDatabase($db_host, $db_name, $db_user , $db_password, '');


$input_secret = isset($_GET['secret']) ? (string) $_GET['secret'] : false;
$input_bot_id = isset($_GET['bot_id']) ? (int) $_GET['bot_id'] : false;


$q = $db->selectById(array(
    'table'=>'bots_profiles',
    'id'=>$input_bot_id,
));

$profile = $db->num_rows > 0 ? $db->fetch_assoc($q) : false;

if ($profile === false || $input_secret !== $profile['secret_seed'])
{
    exit('Access dinied');
}

$mode = isset($_GET['mode']) ? (string) $_GET['mode'] : false;

if ($mode == false)
{
    include 'page.php';
}
elseif ($mode == 'save')
{
    $action = isset($_GET['action']) ? (string) $_GET['action'] : false;

    if ($action == 'stop')
    {
        $db->updateById(array(
            'table'=>'bots_profiles',
            'id'=>$input_bot_id,
            'fields'=>array('status'=>0, 'session_init'=>0),
        ));

        get_https('http://127.0.0.1:3010/set_command/', false, http_build_query(array(
            'action'=>'update_bot_profile',
            'bot_id'=>$input_bot_id,
		)));
    }
    elseif ($action == 'start')
    {
        $fields = array();
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $fields = array(
            'server'=>isset($data['server']) ? $db->escape($data['server']) : '',
            'api_key_id'=>isset($data['api_key_id']) ? $db->escape($data['api_key_id']) : '',
            'api_key_secret'=>isset($data['api_key_secret']) ? $db->escape($data['api_key_secret']) : '',
            'session_start_price'=>isset($data['session_start_price']) ? $db->escape($data['session_start_price']) : '',
            'session_id'=>($profile['session_id'] + 1),
            'session_init'=>0,
            'status'=>1,
            'session_start_time'=>time(),
            'last_ping_time'=>0,
            'price_modifier'=>isset($data['price_modifier']) ? $db->escape($data['price_modifier']) : '',
            'price_reserve_value'=>isset($data['price_reserve_value']) ? $db->escape($data['price_reserve_value']) : '',
            'max_amount'=>isset($data['max_amount']) ? $db->escape($data['max_amount']) : 0,
            'main_pos_cof_x100'=>isset($data['main_pos_cof_x100']) ? $db->escape($data['main_pos_cof_x100']) : 0,
            'main_pos_cof_x50'=>isset($data['main_pos_cof_x50']) ? $db->escape($data['main_pos_cof_x50']) : 0,
            'main_pos_cof_x25'=>isset($data['main_pos_cof_x25']) ? $db->escape($data['main_pos_cof_x25']) : 0,
            'main_pos_cof_x10'=>isset($data['main_pos_cof_x10']) ? $db->escape($data['main_pos_cof_x10']) : 0,
            'main_pos_cof_x5'=>isset($data['main_pos_cof_x5']) ? $db->escape($data['main_pos_cof_x5']) : 0,
            'main_pos_cof_x3'=>isset($data['main_pos_cof_x3']) ? $db->escape($data['main_pos_cof_x3']) : 0,
            'main_pos_cof_x2'=>isset($data['main_pos_cof_x2']) ? $db->escape($data['main_pos_cof_x2']) : 0,
        );

        $db->updateById(array(
            'table'=>'bots_profiles',
            'id'=>$input_bot_id,
            'fields'=>$fields,
        ));

        get_https('http://127.0.0.1:3010/set_command/', false, http_build_query(array(
            'action'=>'update_bot_profile',
            'bot_id'=>$input_bot_id,
		)));
    }
}

?>