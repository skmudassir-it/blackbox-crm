"use client";

import { useEffect, useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { api } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faTrash, faEdit, faCheck, faTimes, faGripVertical,
  faFlag, faUser, faCalendar, faTag, faColumns,
} from "@fortawesome/free-solid-svg-icons";

interface Card {
  _id: string; title: string; description: string;
  priority: "low" | "medium" | "high"; assignee: string;
  dueDate: string | null; labels: string[];
  order: number;
}

interface Column {
  _id: string; title: string; order: number;
  cards: Card[];
}

// ── Priority colors ──
const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
};

export default function KanbanPage() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  // Add column
  const [showAddCol, setShowAddCol] = useState(false);
  const [newColTitle, setNewColTitle] = useState("");

  // Add card
  const [addingToCol, setAddingToCol] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  // Edit card modal
  const [editingCard, setEditingCard] = useState<{ card: Card; colId: string } | null>(null);
  const [editForm, setEditForm] = useState<Card | null>(null);

  // Rename column
  const [renamingCol, setRenamingCol] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState("");

  // ── Fetch board ──
  const fetchBoard = useCallback(async () => {
    const res = await api.get<Column[]>("/api/kanban");
    if (res.ok && res.data) setColumns(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  // ── Drag & drop handler ──
  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic update
    const newCols = [...columns];
    const srcCol = newCols.find((c) => c._id === source.droppableId);
    const destCol = newCols.find((c) => c._id === destination.droppableId);
    if (!srcCol || !destCol) return;

    const cardIdx = srcCol.cards.findIndex((c) => c._id === draggableId);
    if (cardIdx === -1) return;
    const [card] = srcCol.cards.splice(cardIdx, 1);

    if (source.droppableId === destination.droppableId) {
      srcCol.cards.splice(destination.index, 0, card);
    } else {
      destCol.cards.splice(destination.index, 0, card);
    }
    setColumns([...newCols]);

    // Persist
    await api.put("/api/kanban/reorder", {
      sourceColId: source.droppableId,
      destColId: destination.droppableId,
      cardId: draggableId,
      newIndex: destination.index,
    });
  }

  // ── Column operations ──
  async function addColumn() {
    if (!newColTitle.trim()) return;
    const res = await api.post<Column>("/api/kanban/columns", { title: newColTitle.trim() });
    if (res.ok && res.data) {
      setColumns([...columns, { ...res.data, cards: res.data.cards || [] }]);
    }
    setNewColTitle("");
    setShowAddCol(false);
  }

  async function deleteColumn(colId: string) {
    if (!confirm("Delete this column and all its cards?")) return;
    await api.delete(`/api/kanban/columns/${colId}`);
    setColumns(columns.filter((c) => c._id !== colId));
  }

  async function renameColumn(colId: string) {
    if (!renameTitle.trim()) return;
    await api.put(`/api/kanban/columns/${colId}`, { title: renameTitle.trim() });
    setColumns(columns.map((c) => (c._id === colId ? { ...c, title: renameTitle.trim() } : c)));
    setRenamingCol(null);
  }

  // ── Card operations ──
  async function addCard(colId: string) {
    if (!newCardTitle.trim()) return;
    const res = await api.post<Card>(`/api/kanban/columns/${colId}/cards`, { title: newCardTitle.trim() });
    if (res.ok && res.data) {
      setColumns(columns.map((c) => (c._id === colId ? { ...c, cards: [...c.cards, res.data!] } : c)));
    }
    setNewCardTitle("");
    setAddingToCol(null);
  }

  async function updateCard() {
    if (!editingCard || !editForm) return;
    await api.put(`/api/kanban/columns/${editingCard.colId}/cards/${editingCard.card._id}`, editForm);
    setColumns(columns.map((c) =>
      c._id === editingCard.colId
        ? { ...c, cards: c.cards.map((card) => (card._id === editForm._id ? editForm : card)) }
        : c
    ));
    setEditingCard(null);
  }

  async function deleteCard(colId: string, cardId: string) {
    await api.delete(`/api/kanban/columns/${colId}/cards/${cardId}`);
    setColumns(columns.map((c) =>
      c._id === colId ? { ...c, cards: c.cards.filter((card) => card._id !== cardId) } : c
    ));
    setEditingCard(null);
  }

  // ── Helpers ──
  const cardCount = columns.reduce((sum, c) => sum + c.cards.length, 0);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading board...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FontAwesomeIcon icon={faColumns} className="text-secondary" />
            Kanban Board
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {columns.length} columns · {cardCount} cards
          </p>
        </div>
        {!showAddCol ? (
          <button onClick={() => setShowAddCol(true)}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 transition-all">
            <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
            Add Column
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={newColTitle}
              onChange={(e) => setNewColTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addColumn()}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Column name"
              autoFocus
            />
            <button onClick={addColumn}
              className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
              <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => { setShowAddCol(false); setNewColTitle(""); }}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <FontAwesomeIcon icon={faTimes} className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 14rem)" }}>
          {columns.map((column) => (
            <div key={column._id} className="flex-shrink-0 w-80 flex flex-col">
              {/* Column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                {renamingCol === column._id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      value={renameTitle}
                      onChange={(e) => setRenameTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && renameColumn(column._id)}
                      className="flex-1 rounded border border-input bg-background px-2 py-0.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                      autoFocus
                    />
                    <button onClick={() => renameColumn(column._id)}
                      className="p-1 rounded text-emerald-600 hover:bg-emerald-50">
                      <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                    </button>
                    <button onClick={() => setRenamingCol(null)}
                      className="p-1 rounded text-muted-foreground hover:bg-muted">
                      <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      {column.title}
                      <span className="text-xs text-muted-foreground font-normal ml-1">
                        {column.cards.length}
                      </span>
                    </h3>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => { setRenamingCol(column._id); setRenameTitle(column.title); }}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        title="Rename column">
                        <FontAwesomeIcon icon={faEdit} className="h-3 w-3 text-muted-foreground" />
                      </button>
                      <button onClick={() => deleteColumn(column._id)}
                        className="p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete column">
                        <FontAwesomeIcon icon={faTrash} className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Droppable area */}
              <Droppable droppableId={column._id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-xl p-2 space-y-2 transition-colors ${
                      snapshot.isDraggingOver ? "bg-primary/5 border-2 border-dashed border-primary/30" : "bg-muted/30"
                    }`}
                  >
                    {column.cards.map((card, index) => (
                      <Draggable key={card._id} draggableId={card._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-card rounded-xl border border-border/50 p-3 shadow-sm transition-shadow cursor-pointer ${
                              snapshot.isDragging ? "shadow-lg ring-2 ring-primary/30" : "hover:shadow-md"
                            }`}
                            onClick={() => { setEditingCard({ card, colId: column._id }); setEditForm({ ...card }); }}
                          >
                            {/* Drag handle + title */}
                            <div className="flex items-start gap-2">
                              <div {...provided.dragHandleProps} className="mt-0.5 cursor-grab active:cursor-grabbing">
                                <FontAwesomeIcon icon={faGripVertical} className="h-3.5 w-3.5 text-muted-foreground/50" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground leading-snug break-words">
                                  {card.title}
                                </p>
                              </div>
                            </div>

                            {/* Badges row */}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {card.priority && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${priorityColors[card.priority]}`}>
                                  <FontAwesomeIcon icon={faFlag} className="h-2.5 w-2.5 mr-0.5" />
                                  {card.priority}
                                </span>
                              )}
                              {card.assignee && (
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <FontAwesomeIcon icon={faUser} className="h-2.5 w-2.5" />
                                  {card.assignee}
                                </span>
                              )}
                              {card.dueDate && (
                                <span className={`text-[10px] flex items-center gap-1 ${
                                  new Date(card.dueDate) < new Date() ? "text-red-500 font-semibold" : "text-muted-foreground"
                                }`}>
                                  <FontAwesomeIcon icon={faCalendar} className="h-2.5 w-2.5" />
                                  {new Date(card.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {/* Labels */}
                            {card.labels && card.labels.length > 0 && (
                              <div className="flex gap-1 mt-2 flex-wrap">
                                {card.labels.map((label, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">
                                    {label}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Add card form */}
                    {addingToCol === column._id ? (
                      <div className="space-y-2">
                        <input
                          value={newCardTitle}
                          onChange={(e) => setNewCardTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCard(column._id)}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Card title"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button onClick={() => addCard(column._id)}
                            className="flex-1 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 py-1.5 transition-all">
                            Add Card
                          </button>
                          <button onClick={() => { setAddingToCol(null); setNewCardTitle(""); }}
                            className="p-1.5 rounded-lg hover:bg-muted">
                            <FontAwesomeIcon icon={faTimes} className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingToCol(column._id)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                        Add a card
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}

          {/* Empty state */}
          {columns.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FontAwesomeIcon icon={faColumns} className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">No columns yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add a column to start organizing your workflow</p>
              </div>
            </div>
          )}
        </div>
      </DragDropContext>

      {/* ── Edit Card Modal ── */}
      {editingCard && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditingCard(null)}>
          <div className="fixed inset-0 bg-black/40" />
          <div
            className="relative bg-card rounded-2xl border border-border/50 shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Edit Card</h3>
              <button onClick={() => setEditingCard(null)}
                className="p-1.5 rounded-lg hover:bg-muted">
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Title</label>
              <input value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Description</label>
              <textarea value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Priority</label>
                <select value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Card["priority"] })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Assignee</label>
                <input value={editForm.assignee}
                  onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Name" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Due Date</label>
              <input type="date" value={editForm.dueDate ? editForm.dueDate.split("T")[0] : ""}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null as any })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Labels (comma separated)</label>
              <input value={editForm.labels?.join(", ") || ""}
                onChange={(e) => setEditForm({ ...editForm, labels: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="urgent, follow-up, lead" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <button onClick={() => deleteCard(editingCard.colId, editingCard.card._id)}
                className="inline-flex items-center gap-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 h-8 px-3 transition-colors">
                <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                Delete
              </button>
              <button onClick={updateCard}
                className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-5 transition-all">
                <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
