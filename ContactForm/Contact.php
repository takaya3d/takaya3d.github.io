<?php
    session_start();
    $kind = array();
    $kind[1] = 'サービス内容について';
    $kind[2] = '料金について';
    $kind[3] = 'サイトについて';

    $mode = 'input';
    $errmessage = array();

    if(isset($_POST['back'])  &&  $_POST['back']) {
        //何もしない（確認画面）
    } else if(isset($_POST['confirm']) && $_POST['confirm'] ) {

        //送信内容のチェック
        //名前のチェック
         if(!$_POST['fullname']) {
             $errmessage[] = "名前を入力してください。";
         } else if(mb_strlen($_POST['fullname']) > 100) {
             $errmessage[] = "名前は100文字以内にしてください。";
         }
         //不正アクセスを防ぐメソッドを通したPOSTをSESSIONに保存。
         $_SESSION['fullname'] = htmlspecialchars($_POST['fullname'],ENT_QUOTES);

         //セレクトボックスのチェック
         if(!$_POST['mkind']) {
             $errmessage[] = "種別を入力してください。";
         } else if($_POST['mkind'] <= 0 || $_POST['mkind'] >= 4) {
             $errmessage[] = "種別が不正です。";
         }
         $_SESSION['mkind'] = htmlspecialChars($_POST['mkind'], ENT_QUOTES);

         //Eメールのチェック
         if(!$_POST['email']) {
             $errmessage[] = "Eメールを入力してください。";
         } else if(mb_strlen($_POST['email']) > 200) {
             $errmessage[] = "Eメールは200文字以内にしてください。";
         } else if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ) {
             $errmessage[] = "メールアドレスが不正です。";
         }
         $_SESSION['email'] = htmlspecialchars($_POST['email'],ENT_QUOTES);


         if(!$_POST['message']) {
             $errmessage[] = "お問い合わせ内容を入力してください。";
         } else if(mb_strlen($_POST['message']) > 500) {
             $errmessage[] = "お問い合わせ内容は500文字以内にしてください。";
         }
        //不正アクセスを防ぐメソッドを通したPOSTをSESSIONに保存。
        $_SESSION['message'] = htmlspecialchars($_POST['message'],ENT_QUOTES);


        //エラーが存在する場合は、入力画面に戻す。
        if($errmessage) {
            $mode = 'input';
        } else {
            //エラーが存在しない場合、送信完了画面を返す。
            $token = bin2hex(random_bytes(32));
            $_SESSION['token'] = $token;

            $mode = 'confirm';
        } 

    } else if(isset($_POST['send']) && $_POST['send']) {
        // 送信ボタンを押した時
        //CSRF対策-トークンチェック
        if(!$_POST['token'] || !$_SESSION['token'] || !$_SESSION['email']) {
            $errmessage[] = '不正な処理が行われました。';
            $_SESSION     = array();
            $mode         = 'input';
        } else if($_POST['token'] != $_SESSION['token']) {
            $errmessage[] = '不正な処理が行われました。';
            $_SESSION     = array();
            $mode         = 'input';
        } else {
            //正しく入力された内容の場合。
            $message  = 
                        "-----------------------------  \r\n"
                        ."お問い合わせを受け付けました \r\n"
                        ."-----------------------------  \r\n"
                        ."<---お問い合わせの内容---> \r\n" 
                        ."-----------------------------  \r\n"
                        . "名前: " . $_SESSION['fullname'] . "\r\n"
                        . "email: " . $_SESSION['email'] . "\r\n"
                        . "種別:"  . $kind[$_SESSION['mkind']]. "\r\n"
                        ."-----------------------------  \r\n"
                        . "お問い合わせ内容:\r\n"
                        . preg_replace("/\r\n|\r|\n/", "\r\n", $_SESSION['message']) ."\r\n"
                        ."-----------------------------  \r\n";
                //管理者と送信者にメールを送信。　
                mail($_SESSION['email'],'お問い合わせありがとうございます',$message);
                mail('takara787@icloud.com','お問い合わせが届きました',$message);
                $_SESSION = array();
                $mode = 'send';
        }

    } else {
        $_SESSION['fullname'] = "";
        $_SESSION['email'] = "";
        $_SESSION['message'] = "";
    }
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お問い合わせフォーム</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <style>
        body {
            padding: 15px;
            max-width: 600px;
            margin: 0px auto;
            background-color: #f0f8ff;
            font-family: Georgia, "Times New Roman", Times, serif;
        }
        div.button {
            text-align: center;
        }
        #select_modal {
            margin-bottom: 20px;
        }
        h1 {
            text-align:center;
            margin-bottom:25px;
        }
    </style>
</head>
<body>
    <?php if($mode == 'input'){ ?>

        <?php
            if($errmessage) {
                echo '<div class="alert alert-danger" role="alert">';
                echo implode('<br>', $errmessage);
                echo '</div>';
            }    
        ?>
           <!--Getの時にだす入力画面-->
           <h1>TKStudio お問い合わせ</h1>
           <form action="./Contact.php" method="post">
            名前<input type="text" name="fullname"  value="<?php echo $_SESSION['fullname'] ?>" class="form-control"><br>
            Eメール(＊Gmailの場合確認メールが届かない可能性があります。)<input type="email" name="email" value="<?php echo $_SESSION['email']?>" class="form-control"><br>
            種別
            <select name="mkind" class="form-control" id="select_modal">
                <?php foreach($kind as $i => $v){?>
                    <?php if($_SESSION['mkind'] == $i){?>
                        <option value="<?php echo $i?>"selected><?php echo $v?></option>
                    <?php } else { ?>
                        <option value="<?php echo $i?>"><?php echo $v?></option>
                    <?php } ?>
                <?php }?>
            </select>

            お問い合わせ内容<br>
            <textarea name="message" cols="40" rows="8" class="form-control"><?php echo $_SESSION['message']?></textarea><br>
            <div class="button">
                <input type="submit" name="confirm" value="確認に行きます" class="btn btn-primary btn-lg"/>
            </div>
        </form>
<?php } else if( $mode == 'confirm'){?>

        <!--POSTの時の確認画面-->
        <form action="./Contact.php" method="post">
            <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>">

            -------------------<br>
            名前     <?php   echo $_SESSION['fullname']?><br>
            -------------------<br>
            Eメール  <?php echo $_SESSION['email']?><br>
            -------------------<br>
            種別     <?php echo $kind[$_SESSION['mkind']]?><br>
            -------------------<br>
            お問い合わせ内容<br>
            -------------------<br>
            <?php echo nl2br($_SESSION['message'])?><br>
            <input type="submit" name="back" value="戻る" class="btn btn-primary btn-lg"/>
            <input type="submit" name="send" value="送信" class="btn btn-primary btn-lg"/>
        </form>

    <?php } else { ?>
        <!--完了画面-->
        <p class="fs-2">お問い合わせありがとうございました。</p><br>
        <p class="fs-5">ご記入していただいた情報は無事に送信されました。</p><br><br>
        <p class="fs-5">ご記入内容を確認のため自動返信させていただきます。</p><br>
        <a href="../index.html" class="btn btn-primary btn-lg"><span>トップページに戻る</span></a>
    <?php } ?>



</body>
</html>
