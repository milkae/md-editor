<?php
session_start();
if(isset($_POST['data'])) {
	$_SESSION['storedText'] = $_POST['data'];
}
if(isset($_SESSION['storedText'])) {
	header('Content-Type: application/json');
	echo json_encode($_SESSION['storedText']);
}
else {
	header('Content-Type: application/json');
	echo json_encode('...');
}
?>