# 用語集

本プラグインの概念モデルと命名規則を定義する。製品名・プラグイン ID・コマンド ID・CSS クラス・ソース上の型名・識別子など、すべての名称に適用する。

Obsidian API の型（`TFile`, `TFolder` など）および `path` は前提知識とし、本用語集の定義対象外とする。

現状の実装は Repository が Domain モデル（`NoteModel` / `FolderModel`）を直接返す。層の境界は責務の説明用であり、変換専用の中間型は持たない。

---

## 層と用語の対応

- UI / View 層（実装内）
  - Row, Cell
- Domain 層
  - ユーザー向け: Note, Folder
  - 実装内: `groupKey`, `noteGroups`
- Repository 層（Vault 物理表現）
  - ユーザー向け: Folder
  - 実装内: `NoteModel` / `FolderModel` を組み立てて返す（専用の生データ型は持たない）


| 層          | 役割              | ユーザー向け       | 実装内のみ                    |
| ---------- | --------------- | ------------ | ------------------------ |
| UI / View  | 表の見た目・操作単位を扱う   | —            | Row, Cell                |
| Domain     | 表に載せる論理概念を扱う    | Note, Folder | `groupKey`, `noteGroups` |
| Repository | Vault 上の物理実体を扱う | Folder       | （`NoteModel` を直接返す）      |


Folder は Domain と Repository の両方に現れる。意味は同一で、層ごとに責務だけが異なる。表の横軸は Folder そのものであり、列専用の型（Column）は持たない。

ユーザー向け文書・設定・製品名に出すのは Note / Folder（および「日付」などの平易な言い換え）に限る。

---



## 用語定義


| 用語                 | 層                   | 公開範囲   | 定義                                                                                                                                                                                                 |
| ------------------ | ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Note（ノート）          | Domain              | ユーザー向け | 表に並ぶ 1 件。Vault 内の Markdown ノート 1 ファイルに対応する。日記・ログ・予定・完了済みメモなども含む。所属は親 Folder で決まる。コード例: `NoteModel`, `listNotes()`, `upsertNote()`, `openNote()`                                                   |
| Folder（フォルダ）       | Domain / Repository | ユーザー向け | Vault 上の物理フォルダであり、表の横軸のグループでもある。対象フォルダ直下のサブフォルダが表に並ぶ。設定のパス指定でも用いる（`targetFolder` / `excludedFolders`）。文言は「フォルダ」「対象フォルダ」「除外フォルダ」。コード例: `FolderModel`（`path`, `name`）, `listFolders()` |
| 日付                   | Domain / UI         | ユーザー向け | 表の縦軸。フロントマター `datetime` から得る。実装では `Date \| null`（日付なしは `null`）。専用型名は持たない                                                                                                                                  |
| groupKey           | Domain              | 実装内    | 日付 × フォルダ名で Note を束ねるキー。`NoteModel.groupKey` / `generateGroupKey(datetime, folderName)`。フォルダ側は親フォルダの **name**（path ではない）                                                                                  |
| noteGroups         | Domain              | 実装内    | `groupKey` → `NoteModel[]` のマップ。ある日付 × あるフォルダに属する Note の集合。コード例: `noteGroups`                                                                                                                         |
| Row（行）             | UI                  | 実装内    | 表の縦軸の表示単位。1 つの日付（`Date \| null`）に対応する。日付のないノートは表下部の行に集約する。コード例: `DataRow`, `HeaderRow`                                                                                                                 |
| Cell（セル）           | UI                  | 実装内    | 日付 × フォルダの交点を表す表示単位（HTML `<td>` に対応）。交点のノート集合は Domain の `noteGroups` から読む。コード例: `Cell`                                                                                                                   |


`NoteModel` の主なフィールド: `{ path, datetime, folder, title }`。ここで `folder` は親フォルダの **name**。

---



## 命名の指針

1. **Repository** は Folder / Note を扱う。Obsidian API（`TFile`, `TFolder`, `path`）には忠実に従う。UI 用語（Row / Cell）は持ち込まない。生データ専用型は設けず、読み取り結果を `NoteModel` / `FolderModel` として返す
2. **Domain** は Note / Folder / `groupKey` / `noteGroups` を使う。Cell は持ち込まない。横軸の識別は Folder（表上では `folder.name`）で行い、列専用の型は持たない
3. **UI** は Row / Cell を使う。横軸のヘッダ・セルは Folder を直接渡す。Domain に UI 用語を逆輸入しない
4. **ユーザー向け**（README・設定・製品名・コマンド名など）に出す語は Note / Folder に限る。`groupKey` / `noteGroups` / Row / Cell は実装内に留める。縦軸は「日付」と平易に書いてよい
5. 過度な抽象化を避ける。現状はフォルダ = 表の横軸の 1:1 なので、Folder をそのまま横軸とし、グルーピングには親フォルダ名を用いる
