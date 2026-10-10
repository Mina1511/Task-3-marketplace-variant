
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = {
  title: '',
  description: '',
  price: 0,
  category: 'other',
  condition: 'used',
  status: 'active'
}

export default function ListingForm() {
  const nav = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // TODO 3: Load the listing when editing
  useEffect(() => {
    if (!id) return

    async function loadListing() {
      try {
        const res = await api.get(`/listings/${id}`)
        const listing = res.data.listing

        setForm({
          title: listing.title,
          description: listing.description || '',
          price: Number(listing.price),
          category: listing.category,
          condition: listing.condition,
          status: listing.status
        })
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load listing'
        )
      }
    }

    loadListing()
  }, [id])

  // TODO 1: Update the form state
  function onChange(e) {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  // TODO 2 & 3: Create or update a listing
  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      if (id) {
        // Edit an existing listing
        await api.patch(`/listings/${id}`, form)
      } else {
        // Create a new listing
        const { status, ...newListing } = form
        await api.post('/listings', newListing)
      }

      nav('/listings')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to save listing'
      )
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">
        {id ? 'Edit Listing' : 'Sell an Item'}
      </h1>

      <form onSubmit={onSubmit} className="space-y-3">

        <div>
          <label>Title</label>
          <input
            className="input w-full"
            type="text"
            name="title"
            value={form.title}
            onChange={onChange}
            required
            placeholder="Calculus textbook"
          />
        </div>

        <div>
          <label>Price</label>
          <input
            className="input w-full"
            type="number"
            name="price"
            value={form.price}
            onChange={onChange}
            min="0"
            step="any"
            required
          />
        </div>

        <div>
          <label>Category</label>
          <select
            className="input w-full"
            name="category"
            value={form.category}
            onChange={onChange}
          >
            <option value="textbooks">Textbooks</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label>Condition</label>
          <select
            className="input w-full"
            name="condition"
            value={form.condition}
            onChange={onChange}
          >
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="used">Used</option>
            <option value="worn">Worn</option>
          </select>
        </div>

        <div>
          <label>Description (optional)</label>
          <textarea
            className="input w-full"
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            placeholder="Describe your item..."
          />
        </div>

        {id && (
          <div>
            <label>Status</label>
            <select
              className="input w-full"
              name="status"
              value={form.status}
              onChange={onChange}
            >
              <option value="active">Active</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button className="btn" type="submit">
          {id ? 'Save Changes' : 'Create Listing'}
        </button>

      </form>
    </div>
  )
}
