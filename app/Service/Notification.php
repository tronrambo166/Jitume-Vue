<?php
namespace App\Service;
use App\Models\Notifications;

class Notification
{
    public function create($receiver_id,$customer_id,$text,$link,$type)
    {
        $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
        $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $receiver_id,
            'customer_id' => $customer_id,
            'text' => $text,
            'link' => $link,
            'type' => $type,
        ]);
    }

    public function createWithBidId($receiver_id,$customer_id,$bid_id,$text,$link,$type)
    {
        $now=date("Y-m-d H:i"); $date=date('d M, h:i a',strtotime($now));
        $addNoti = Notifications::create([
            'date' => $date,
            'receiver_id' => $receiver_id,
            'customer_id' => $customer_id,
            'bid_id' => $bid_id,
            'text' => $text,
            'link' => $link,
            'type' => $type,
        ]);
    }
}
