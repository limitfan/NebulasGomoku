# NebulasGomoku五子棋
用户可以在桌面和移动平台使用该五子棋DApp，完成与五子棋AI的对战，记录胜利所耗时间与相应步骤。其它用户可以观看排行榜中对应的五子棋。本DApp同时在用户对战和观看五子棋时有系统记录的相应的运行状态。

# 五子棋DApp运行于星云链，安装相应平台钱包依赖
[WebExtensionWallet](https://github.com/ChengOrangeJu/WebExtensionWallet)

[Android](https://nano.nebulas.io/index_cn.html)

[iOS](https://itunes.apple.com/hk/app/nas-nano/id1281191905?l=zh&ls=1&mt=8)

# SmartContract相关接口
-saveStaus(actioncode) 保存用户对战与观看五子棋的运行状态

-saveScore(score, steps) 保存用户对战的得分与相应步骤

-getAllStatus() 得到所有用户的使用本DApp的运行状态

-getTopScores() 得到排行榜用户的得分与相应步骤


# 运行截图
桌面版
![Alt text](/img/gomoku1.PNG?raw=true "Optional Title")


移动版

![Alt text](/img/gomoku2.png?raw=true "Optional Title")
